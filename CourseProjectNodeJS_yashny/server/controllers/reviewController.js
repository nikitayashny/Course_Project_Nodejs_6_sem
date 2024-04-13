const { Review, User } = require('../models/models')

class ReviewController {
    async createReview(req, res) {
        try {
            const { userId, productId, text } = req.body

            const review = await Review.create({userId: userId, productId: productId, text: text})
            return res.json(review)
        } catch (e) {
            res.json(e)
        }   
    }

    async getReviews(req, res) {
        try {
            const { productId } = req.params

            const reviews = await Review.findAll({
                where: {
                    productId
                },
                include: User
            })

            return res.json(reviews)
        } catch (e) {
            res.json(e)
        }   
    }

    async deleteReview(req, res) {
        try {
            const { id, userId } = req.params
            
            const review = await Review.findOne({
                where: {
                    id: id
                }
            })
            
            const user = await User.findOne({
                where: {
                    id: userId
                }
            })
            
            if (userId != review.userId && user.role != "ADMIN")
                return res.json("Невозможно удалить чужой отзыв")

            await review.destroy()

            return res.json(review)
        } catch (e) {
            res.json(e)
        }   
    }
}

module.exports = new ReviewController()