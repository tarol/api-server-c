/*
 * @Author: taroljiang
 * @Date: 2022-01-25 11:09:04
 * @Description:
 */

const _ = require('lodash');

let count = 0;

function createAlarm() {
  return {
    type: 'add',
    id: count++
  };
}

function removeAlarm() {
  return {
    type: 'remove',
    id: _.random(0, count)
  };
}

function pack(type) {
  const rst = [];
  _.range(_.random(10, 100)).forEach(() => {
    if(type === 'add') {
      rst.push(createAlarm());
    }
    if(type === 'mixin') {
      const number = _.random(0, 9);
      if(number < 7) {
        rst.push(createAlarm());
      }else {
        rst.push(removeAlarm());
      }
    }
  });
  return _.shuffle(rst);
}

process.on('message', msg => {
  if(msg === 'storm') {
    let start = Date.now();
    let now;
    while(now = Date.now(), now - start < 2000) {
      process.send(pack('add'));
    }
    start = now;
    while(now = Date.now(), now - start < 3000) {
      process.send(pack('mixin'));
    }
    console.log(count);
  }
});
