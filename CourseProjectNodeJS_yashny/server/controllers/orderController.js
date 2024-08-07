const {Basket, Product, BasketProduct, Order, OrderProduct, User, OrderStatus} = require('../models/models')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const { emit } = require('nodemon');
require('dotenv').config();

class OrderController {
    async getAllOrders(req, res) {
        try {
            const orders = await Order.findAll({
                include: [
                  {
                    model: Product,
                    through: {
                      model: OrderProduct,
                    },
                  },
                  {
                    model: User,
                  },
                  {
                    model: OrderStatus,
                  },
                ],
                
              });
          
              const orderList = [];
          
              for (const order of orders) {
                const products = order.products.map((product) => ({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  rating: product.rating,
                  img: product.img,
                  isSold: product.isSold,
                  brandId: product.brandId
                }));

          
          
                const orderData = {
                  id: order.id,
                  total_cost: order.total_cost,
                  userId: order.user.id,
                  date: order.createdAt,
                  status: order.order_status.name,
                  products: products,
                  user: order.user
                };
          
                orderList.push(orderData);
              }
          
              return res.json(orderList); 
        } catch(e) {
            return res.json(e)
        }
    }

  async getUserOrders(req, res) {
      try {
        const { userId } = req.params
        const orders = await Order.findAll({
          include: [
            {
              model: Product,
              through: {
                model: OrderProduct,
              },
            },
            {
              model: User,
            },
            {
              model: OrderStatus,
            },
          ],
          where: {userId}
        });
    
        const orderList = [];
    
        for (const order of orders) {
          const products = order.products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            rating: product.rating,
            img: product.img,
            isSold: product.isSold,
            brandId: product.brandId
          }));
    
          const orderData = {
            id: order.id,
            total_cost: order.total_cost,
            userId: order.user.id,
            date: order.createdAt,
            status: order.order_status.name,
            products: products,
          };
    
          orderList.push(orderData);
        }
    
        return res.json(orderList); 
      } catch(e) {
          return res.json(e)
      }
  }

  async getOneUserOrder(req, res) {
    try {
      const { userId, orderId } = req.params
      const orders = await Order.findAll({
        include: [
          {
            model: Product,
            through: {
              model: OrderProduct,
            },
          },
          {
            model: User,
          },
          {
            model: OrderStatus,
          },
        ],
        where: {id: orderId, userId}
      });
  
      const orderList = [];
  
      for (const order of orders) {
        const products = order.products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          rating: product.rating,
          img: product.img,
          isSold: product.isSold,
          brandId: product.brandId
        }));
  
        const orderData = {
          id: order.id,
          total_cost: order.total_cost,
          userId: order.user.id,
          date: order.createdAt,
          status: order.order_status.name,
          products: products,
        };
  
        orderList.push(orderData);
      }
  
      return res.json(orderList); 
    } catch(e) {
        return res.json(e)
    }
  }

  async makeOrder(req, res) {
    try {
      const {userId} = req.params
      const basket = await Basket.findOne({
        where: {
            userId: {
                [Op.eq]: userId
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

      if (products.length == 0)
        return res.json("Корзина пуста")

      const total_cost = products.reduce((sum, product) => sum + product.price, 0)
      
      const order = await Order.create({ userId: userId, orderStatusId: 1, total_cost: total_cost });
      let hasIsSold = false;
      const orderProducts = products.map((product) => {
        if (product.isSold == true)
          hasIsSold = true;
        return {
          orderId: order.id,
          productId: product.id,
        };
      });

      if (hasIsSold)
        return res.json("Товар продан")

      await OrderProduct.bulkCreate(orderProducts);

      await Product.update(
        { isSold: true },
        {
          where: {
            id: {
              [Op.in]: productIds,
            },
          },
        }
      );

      await BasketProduct.destroy({
        where: {
          productId: {
            [Op.in]: productIds,
          },
        },
      });

      return res.json(orderProducts);
    } catch(e) {
        return res.json(e)
    }
  }




  async deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: {
        id: {
          [Op.in]: [orderId],
        },
      },
    });

    if (order.orderStatusId != 1) {
      return res.json({ message: "Отмена заказа невозможна" });
    }

    const orderProducts = await OrderProduct.findAll({
      where: {
        orderId: {
          [Op.in]: [orderId],
        },
      },
    });

    const productIds = orderProducts.map((orderProduct) => orderProduct.productId);

    await OrderProduct.destroy({
      where: {
        orderId: {
          [Op.in]: [orderId],
        },
      },
    });

    await order.destroy();

    await Product.update(
      { isSold: false },
      {
        where: {
          id: {
            [Op.in]: productIds,
          },
        },
      }
    );

    return res.json({ order: order });
  } catch (e) {
    return res.json(e);
  }
  }

  async changeOrderStatus(req, res) {
    try {
      const { orderId, orderStatusId } = req.body;

      const order = await Order.findOne({
        where: {
          id: orderId
        },
        include: Product
      });

      let orderProducts = '';
      order.products.forEach(product => {
          orderProducts += product.name + ', '
      });
      const orderProductsnew = orderProducts.slice(0, -2);

      await Order.update(
        { orderStatusId: orderStatusId },
        {
          where: {
            id: {
              [Op.in]: [orderId],
            },
          },
        }
      );

      const user = await User.findOne({
        where: {
          id: {
            [Op.in]: [order.userId],
          }
        },
      });

      
      const statusMap = {
        1: 'В обработке',
        2: 'Подтверждено',
        3: 'Выполнено'
      };
     
      const status = statusMap[orderStatusId];

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.USER_EMAIL, 
          pass: process.env.PASS_EMAIL 
        }
      });
      
      let mailOptions;
      if (status == 'Выполнено') {
          mailOptions = {
          from: process.env.USER_EMAIL,
          to: user.email,
          subject: 'Изменение статуса заказа',
          html: 'Ваш заказ: ' + orderProductsnew + '\nТекущий статус заказа: ' + status + '.\nЗабрать заказ вы можете по адресу ... с 9:00 до 21:00'
        };
      }
      else {
          mailOptions = {
          from: process.env.USER_EMAIL,
          to: user.email,
          subject: 'Изменение статуса заказа',
          html: 'Ваш заказ: ' + orderProductsnew + '\nТекущий статус заказа: ' + status
        };
      }

      transporter.sendMail(mailOptions, (error, info) => {
      });

      return res.json(order);
    } catch (e) {
      return res.json(e);
    }
  }
}



module.exports = new OrderController()