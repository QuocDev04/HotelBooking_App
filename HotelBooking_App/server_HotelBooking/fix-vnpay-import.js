const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'node_modules/vnpay/index.js'); // hoặc file nào đó

let content = fs.readFileSync(filePath, 'utf-8');
content = content.replace(/dayjs\/plugin\/timezone(['"])/g, 'dayjs/plugin/timezone.js$1');

fs.writeFileSync(filePath, content);

console.log('Fixed vnpay import paths');
