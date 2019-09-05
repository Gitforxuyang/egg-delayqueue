'use strict';

const assert = require('assert');

const amqp = require('amqplib');
const Promise = require('bluebird');

/**
 * mount apqp on app
 * @param {Application} app app
 */
module.exports = app => {
  if (app.config.delayqueue.clients) {
    app.config.delayqueue = {
      clients: app.config.delayqueue.clients,
    }
  }
  app.addSingleton('delayqueue', createClient);
};

async function createClient(config, app) {
  assert(
    config.url || config.connectOptions,
    "[egg-amqplib] url and connectOptions can't be empty at the same time on config"
  );

  const connectOptions = config.url || parseOptions(config.connectOptions);
  app.coreLogger.info(
    `[egg-amqplib] connection on ${JSON.stringify(connectOptions)}`
  );

  const db = await connect(
    connectOptions,
    config.socketOptions,
    app
  );
  app.coreLogger.info('[egg-amqplib] connection success');
  /**
     * 自定义部分
     * 做两件事 加入申明的queue为queue
     * 1：申明queue.XQ queue.DQ 分别代表死信队列和延时队列
     */
  const initCh = await db.createChannel()
  await initCh.assertExchange('node.dx', 'direct', {
    durable: true,
  });
  const _createChannel = db.createChannel;
  db.createChannel = async function () {
    const ch = await _createChannel.call(this, arguments);
    const _assertQueue = ch.assertQueue;
    let dqQueue;
    let xqQueue;
    ch.assertQueue = async function (queueName) {
      if (!['action', 'blackWhiteList', 'data-sync', 'doubt-user',
        'doubtText', 'msg', 'order', 'party-change', 'party-create', 'post-change', 'post-create',
        'street', 'user', 'voice'].includes(queueName)) {
        await _assertQueue.call(this, queueName,
          { durable: true, deadLetterExchange: 'node.dx', deadLetterRoutingKey: `${queueName}.DQ` });
      }
      dqQueue = await _assertQueue.call(this, `${queueName}.DQ`, {
        durable: true, deadLetterExchange: '', deadLetterRoutingKey: `${queueName}`, messageTtl: 10000,
      });
      await ch.bindQueue(dqQueue.queue, 'node.dx', `${queueName}.DQ`)
      xqQueue = await _assertQueue.call(this, `${queueName}.XQ`, {
        durable: true, deadLetterExchange: '', deadLetterRoutingKey: `${queueName}`, queueMode: 'lazy',
      });
    };
    const _consume = ch.consume;
    ch.consume = function (queue, func) {
      _consume.call(this, queue, async msg => {
        await func(msg);
      });
    };
    const _nack = ch.nack;
    ch.nack = async function (msg) {
      if (msg && msg.properties && msg.properties.headers) {
        const death = msg.properties.headers['x-death']
        if (death) {
          for (const item of death) {
            if (item.count >= 3) {
              await ch.sendToQueue(xqQueue.queue, msg.content)
              await ch.ack(msg);
              return;
            }
          }
        }
      }
      await ch.reject(msg, false)
    }
    return ch;
  };
  return db;
}

/**
 * get amqp connection
 *
 * @param {*} connectOptions connectOptions
 * @param {*} socketOptions socketOptions
 * @param {*} app egg context
 * @param {number} [retryCount=1] retry count
 */
async function connect(connectOptions, socketOptions, app, retryCount = 1) {
  if (retryCount > 10) process.exit(0);
  try {
    app.coreLogger.info(`[egg-amqplib] Reconnecting count: ${retryCount}`);
    return amqp.connect(connectOptions, socketOptions);
  } catch (error) {
    app.coreLogger.info(`[egg-amqplib] connect error: ${error.message}`);
    retryCount++;

    await Promise.delay(3000);
    return connect(
      connectOptions,
      socketOptions,
      app,
      retryCount
    );
  }
}

/**
 * Parse amqplib connect options
 *
 * @param {*} connectOptions amqplib connect options
 * @return {*} amqplib connect options
 */
function parseOptions(connectOptions) {
  return Object.assign(
    {
      protocol: 'amqp',
      hostname: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
      locale: 'en_US',
      frameMax: 0,
      heartbeat: 0,
      vhost: '/',
    },
    connectOptions
  );
}
