# egg-delayqueue

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-delayqueue.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-delayqueue
[travis-image]: https://img.shields.io/travis/eggjs/egg-delayqueue.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-delayqueue
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-delayqueue.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-delayqueue?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-delayqueue.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-delayqueue
[snyk-image]: https://snyk.io/test/npm/egg-delayqueue/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-delayqueue
[download-image]: https://img.shields.io/npm/dm/egg-delayqueue.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-delayqueue

<!--
Description here.
-->

## Install

```bash
$ npm i egg-delayqueue --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.delayqueue = {
  enable: true,
  package: 'egg-delayqueue',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
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
  },;
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
