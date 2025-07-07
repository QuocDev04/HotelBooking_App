import fs from 'fs/promises';
import path from 'path';

const vnpayPath = path.resolve('node_modules/vnpay');

async function fix() {
    try {
        const files = await fs.readdir(vnpayPath);
        // Tìm file js bắt đầu bằng 'chunk-'
        const chunkFile = files.find(file => file.startsWith('chunk-') && file.endsWith('.js'));

        if (!chunkFile) {
            console.warn('Không tìm thấy file chunk-*.js để fix trong vnpay');
            return;
        }

        const filePath = path.join(vnpayPath, chunkFile);
        let content = await fs.readFile(filePath, 'utf-8');

        // Sửa import như bạn cần (ví dụ)
        content = content.replace(/dayjs\/plugin\/timezone(['"])/g, 'dayjs/plugin/timezone.js$1');

        await fs.writeFile(filePath, content);

        console.log(`Đã fix import trong file ${chunkFile}`);
    } catch (err) {
        console.error('Lỗi khi fix vnpay:', err);
    }
}

fix();
