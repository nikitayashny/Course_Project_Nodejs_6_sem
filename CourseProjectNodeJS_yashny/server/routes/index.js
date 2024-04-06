const Router = require('express')
const router = new Router()
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const adminRouter = require('./adminRouter')
const rateRouter = require('./rateRouter')
const basketRouter = require('./basketRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/product', productRouter)
router.use('/admin', adminRouter)
router.use('/rate', rateRouter)
router.use('/basket', basketRouter)

module.exports = router