const {Rating, Product} = require('../models/models')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize');

class RateController {
    async create(req, res) {
        const {number, productId, userId} = req.body

        const rates = await Rating.findAll({
            where: {
                productId: {
                  [Op.eq]: productId
                }
              }
        })

        const hasMatchingUserId = rates.some(rate => rate.userId === userId);

        if (hasMatchingUserId) {
            const userRate = await Rating.findOne({
            where: {
                userId: {
                  [Op.eq]: userId
                },
                productId: {
                  [Op.eq]: productId
                }
              }})

            userRate.rate = number;
            await userRate.save()
            
            const product = await Product.findOne({
              where: {
                  id: {
                    [Op.eq]: productId
                  }
                }
            });

            const rates2 = await Rating.findAll({
              where: {
                  productId: {
                    [Op.eq]: productId
                  }
                }
          })

            const sum = rates2.reduce((total, rate) => {
              const value = parseInt(rate.rate);
              if (!isNaN(value)) {
                return total + value;
              }
              return total;
            }, 0);
            
          
          product.rating = Math.ceil(sum / rates2.length);
          await product.save();
  
          return res.json(userRate)
        }

        const rate = await Rating.create({rate: number, userId: userId, productId: productId})

        const product = await Product.findOne({
            where: {
                id: {
                  [Op.eq]: productId
                }
              }
        });

        const sum = rates.reduce((total, rate) => {
            const value = parseInt(rate.rate);
            if (!isNaN(value)) {
              return total + value;
            }
            return total;
          }, 0);
          
        
        product.rating = Math.ceil((rate.rate + sum) / (rates.length + 1));
        await product.save();

        return res.json(rate)
    }
}

module.exports = new RateController()