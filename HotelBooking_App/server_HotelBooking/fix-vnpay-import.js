import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, 'node_modules/vnpay/index.js');

async function fix() {
    let content = await fs.readFile(filePath, 'utf-8');
    content = content.replace(/dayjs\/plugin\/timezone(['"])/g, 'dayjs/plugin/timezone.js$1');
    await fs.writeFile(filePath, content);
    console.log('Fixed vnpay import paths');
}

fix();
