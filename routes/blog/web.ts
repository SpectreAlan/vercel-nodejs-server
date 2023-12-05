const Router = require('@koa/router');

const userRouter = new Router();

userRouter.get('/api/users', async (ctx:any) => {
    ctx.body = 'xxxx'
});

export default userRouter;