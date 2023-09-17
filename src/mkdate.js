const moment = require('moment');
const fs = require('fs');
const dir = './sourceDir';
 
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

for(let i= 1; i <= 30; i++) {
  const futureDate = moment().add(i, 'days');
  fs.mkdirSync(`${dir}/${futureDate.format('YYYY-MM-DD')}`, { recursive: true });
}
