"use strict";
const config = require('./config');
const subber = require('./lib/subber');
const io = require('socket.io')(config.socketIOPort);
const _ = require('lodash');

io.on('connection', function(socket) {
  socket._subscribe = {};
  socket.on('disconnect', function() {
    _.forEach(socket._subscribe, function(cb, tag) {
      subber.unsubscribe(tag, cb);
    });
  });
  socket.on('subscribe', function(tag) {
    if (socket._subscribe[tag]) {
      console.warn('socket is already subscribe %s', tag);
      return;
    }
    let cb = function(msg) {
      socket.emit('subscribe', {
        topic: tag,
        data: msg.toString()
      });
    };
    socket._subscribe[tag] = cb;
    subber.subscribe(tag, cb);
  });
  socket.on('unsubscribe', function(tag) {
    let cb = socket._subscribe[tag];
    if (cb) {
      delete socket._subscribe[tag];
      subber.unsubscribe(tag, cb);
    }
  });
});
