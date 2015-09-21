"use strict";
const io = require('socket.io-client');
const socket = io.connect('http://localhost:6020');
let total = 0;
socket.on('subscribe', function(data) {
  console.dir(data);
  total++;
  if (total === 10) {
    socket.emit('unsubscribe', 'test');
  }
});
socket.on('connect', function(argument) {
  console.dir('connection')
  socket.emit('subscribe', 'test');
});


;
(function() {

}.call(this));
