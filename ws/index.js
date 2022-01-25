/*
 * @Author: taroljiang
 * @Date: 2022-01-21 16:05:35
 * @Description:
 */
const creator = require('socket.io');
const cp = require('child_process');

module.exports = function(server) {
  const io = creator(server, {
    pingTimeout: 100000
  });
  io.on('connection', socket => {
    const n = cp.fork(`${__dirname}/cp.js`);
    socket.on('request', v => {
      socket.emit('response', v);
    });
    socket.on('storm', () => {
      n.send('storm');
    });
    n.on('message', msg => {
      socket.emit('alarm', msg);
    });
  });
};
