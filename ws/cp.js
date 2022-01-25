/*
 * @Author: taroljiang
 * @Date: 2022-01-25 11:09:04
 * @Description:
 */

process.on('message', msg => {
  if(msg === 'storm') {
    const start = Date.now();
    let now;
    let count = 0;
    while(now = Date.now(), now - start < 5000) {
      process.send({
        type: 'alarm',
        id: count++
      });
    }
    console.log(count);
  }
});
