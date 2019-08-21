'use strict';

/**
 * egg-delayqueue default config
 * @member Config#delayqueue
 * @property {String} SOME_KEY - some description
 */
exports.delayqueue = {
  client: {
    // url: 'amqp://localhost',
    connectOptions: {
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
    // socketOptions: {
    //   cert: certificateAsBuffer, // client cert
    //   key: privateKeyAsBuffer, // client key
    //   passphrase: 'MySecretPassword', // passphrase for key
    //   ca: [caCertAsBuffer], // array of trusted CA certs
    // },
  },
};
