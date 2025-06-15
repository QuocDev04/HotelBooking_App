import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import path from "path"; // Thêm nếu bạn dùng alias hoặc cần resolve đường dẫn

export default defineConfig({
    resolve: {
        alias: {
            'dayjs/plugin/timezone': 'dayjs/plugin/timezone.js', // Fix lỗi vnpay import
        },
    },

    server: {
        port: 8080,
    },

    plugins: [
        ...VitePluginNode({
            adapter: "express",
            appPath: "./src/app.js",
            exportName: "viteNodeApp",
            initAppOnBoot: false,
            tsCompiler: "esbuild",
            swcOptions: {},
        }),
    ],

    optimizeDeps: {
        // optional
    },
});
