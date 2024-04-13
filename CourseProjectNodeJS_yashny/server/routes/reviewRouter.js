const Router = require('express')
const router = new Router()
const reviewController = require('../controllers/reviewController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/:productId', reviewController.getReviews)
router.post('/', authMiddleware, reviewController.createReview)
router.delete('/:id/:userId', authMiddleware, reviewController.deleteReview)

module.exports = router