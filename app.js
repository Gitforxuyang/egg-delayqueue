'use strict';

const delayqueue = require('./lib/delayqueue');

module.exports = app => {
    delayqueue(app);
};
