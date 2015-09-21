"use strict";
const config = require('../config');
const _ = require('lodash');
var socketDict = {};
const zmq = require('zmq');

exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;

/**
 * [subscribe description]
 * @param  {[type]}   tag [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
function subscribe(tag, cb) {
  let socket = getSubscribeSocket(tag, cb);
  socket._subscribeCbList.push(cb);
}

/**
 * [unsubscribe description]
 * @param  {[type]}   tag [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
function unsubscribe(tag, cb) {
  let socket = socketDict[tag];
  if (socket) {
    _.pull(socket._subscribeCbList, cb);
  }
}


/**
 * [getSubscribeSocket description]
 * @param  {[type]} tag [description]
 * @return {[type]}     [description]
 */
function getSubscribeSocket(tag) {
  if (socketDict[tag]) {
    return socketDict[tag];
  }
  let socket = zmq.socket('sub');
  let url = 'tcp://0.0.0.0:' + config.zmqPort;
  socket.connect(url);
  socket.subscribe(tag);
  console.info('subscribe %s %s', url, tag);
  socketDict[tag] = socket;
  socket._subscribeCbList = [];
  socket.on('message', function(topic, msg) {
    let fns = _.clone(socket._subscribeCbList);
    _.forEach(fns, function(cb) {
      cb(msg);
    });
  });
  return socketDict[tag];
}
