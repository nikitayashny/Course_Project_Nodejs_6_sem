const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', checkRole('ADMIN'), authMiddleware, orderController.getAllOrders) 
router.get('/:userId', authMiddleware, orderController.getUserOrders) 
router.get('/:userId/:orderId', authMiddleware, orderController.getOneUserOrder) 
router.post('/:userId', authMiddleware, orderController.makeOrder) 
router.delete('/:orderId', authMiddleware, orderController.deleteOrder) 
router.put('/', checkRole('ADMIN'), authMiddleware, orderController.changeOrderStatus)

module.exports = router