const userRouter = require("./user")
const productRouter = require("./product")
const categoryRouter = require("./category")
const orderRouter = require("./order")
const {notFound, errHandler} = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/category', categoryRouter)
    app.use('/api/order', orderRouter)

    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes