const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const Router = require('@koa/router');

const app = new Koa();
const loadRoutes = (dir: string) => {
    const files = fs.readdirSync(dir);
    files.forEach((file:any) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            loadRoutes(filePath);
        } else {
            // 如果是文件，则尝试加载路由
            try {
                const route = require(filePath).default;
                const router = new Router();

                // 如果路由文件导出的是 Koa 的 Router 实例，直接使用该实例
                if (route instanceof Router) {
                    app.use(route.routes()).use(route.allowedMethods());
                } else {
                    // 如果路由文件导出的是路由处理函数等内容，你需要在这里根据实际情况进行处理
                    console.error(`Invalid router in file ${filePath}`);
                }
            } catch (error) {
                console.error(`Error loading file ${filePath}:`, error);
            }
        }
    });
};

// 获取路由文件夹路径
const routesPath = path.join(__dirname, 'routes');

// 调用递归函数加载所有路由文件
loadRoutes(routesPath);

// 监听端口
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
