const {Basket, Product, BasketProduct} = require('../models/models')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize');

class BasketController {
    async getBasket(req, res) {
        try {
            const { id } = req.params
            const basket = await Basket.findOne({
                where: {
                    userId: {
                        [Op.eq]: id
                    }
                }
            })

            const basketProducts = await BasketProduct.findAll({
                where: {
                    basketId: {
                        [Op.eq]: basket.id
                    }
                }
            })

            const productIds = basketProducts.map(basketProduct => basketProduct.productId);

            const products = await Product.findAll({
                where: {
                    id: {
                        [Op.in]: productIds
                    }
                }
            })

            return res.json(products)
        } catch(e) {
            return res.json(e)
        }
    }

    async addToBasket(req, res) {
        try {
            const { userId, productId } = req.body

            const basket = await Basket.findOne({
                where: {
                    userId: {
                        [Op.eq]: userId
                    }
                }
            })
        
            const basketId = basket.id

            const basketProductExist = await BasketProduct.findOne({
                where: {
                    basketId: {
                        [Op.eq]: basketId
                    },
                    productId: {
                        [Op.eq]: productId
                    }
                }
            })

            if (basketProductExist)
                return res.json("Такой товар уже есть в корзине")

            const basketProduct = await BasketProduct.create({ basketId: basketId, productId: productId });
        
            return res.json(basketProduct)
        } catch(e) {
            return res.json(e)
        }
    }

    async deleteFromBasket(req, res) {
        try {
            const { userId, productId } = req.params

            const basket = await Basket.findOne({
                where: {
                    userId: {
                        [Op.eq]: userId
                    }
                }
            })
        
            const basketId = basket.id

            const basketProduct = await BasketProduct.findOne({ 
                where: {
                    basketId: {
                        [Op.eq]: basketId
                    },
                    productId: {
                        [Op.eq]: productId
                    }
                }
            });

            if (!basketProduct)
                return res.json("Такого товара нет в корзине")

            await basketProduct.destroy()
        
            return res.json(basketProduct)
        } catch(e) {
            return res.json(e)
        }
    }
}

module.exports = new BasketController()