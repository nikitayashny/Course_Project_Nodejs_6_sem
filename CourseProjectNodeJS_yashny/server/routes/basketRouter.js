const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/:id', authMiddleware, basketController.getBasket)
router.post('/', authMiddleware, basketController.addToBasket)
router.delete('/:userId/:productId', authMiddleware, basketController.deleteFromBasket)

module.exports = router