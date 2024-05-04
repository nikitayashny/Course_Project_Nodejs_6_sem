const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const { promises: fsPromises } = require('fs');
const {Product, ProductInfo, BasketProduct} = require('../models/models')
const ApiError = require('../error/ApiError')

class ProductController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            const fileName = uuid.v4() + '.jpg';
        
            const img = req.file;
            const uploadPath = path.resolve(__dirname, '..', 'static', fileName);
        
            fs.rename(img.path, uploadPath, async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Failed to upload file' });
                }
        
                const product = await Product.create({ name, price, brandId, typeId, img: fileName });

                if (info) {
                    info = JSON.parse(info)
                    info.forEach(i =>
                        ProductInfo.create({
                            title: i.title,
                            description: i.description,
                            productId: product.id
                        })
                    )
                }

                return res.json(product);
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, isSold, limit, page} = req.query
        let products;
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        
        
        if (!isSold) {
            if (!brandId && !typeId) {
                products = await Product.findAndCountAll({limit, offset});
            }
            if (brandId && !typeId) {
                products = await Product.findAndCountAll({ where: { brandId }, limit, offset });
            }
            if (!brandId && typeId) {
                products = await Product.findAndCountAll({where:{typeId}, limit, offset})
            }
            if (brandId && typeId) {
                products = await Product.findAndCountAll({where:{typeId, brandId}, limit, offset}) 
            }
           
        }
        else {
            if (!brandId && !typeId) {
                products = await Product.findAndCountAll({where: {isSold}, limit, offset});
            }
            if (brandId && !typeId) {
                products = await Product.findAndCountAll({ where: { brandId, isSold }, limit, offset });
            }
            if (!brandId && typeId) {
                products = await Product.findAndCountAll({where:{typeId, isSold}, limit, offset})
            }
            if (brandId && typeId) {
                products = await Product.findAndCountAll({where:{typeId, brandId, isSold}, limit, offset}) 
            }
        }
        
        return res.json(products)
    }

    async getOne(req, res) {
        const {id} = req.params
        const product = await Product.findOne(
            {
                where: {id},
                include: [{model: ProductInfo, as: 'info'}]
            }
        )
        if (!product){
            return res.status(404).json({ message: 'Товар не найден' });
        }
        return res.json(product)
    }

    async deleteOneByName(req, res) {
        const { id } = req.params;
    
        try {
            const product = await Product.findOne({
                where: { id }
            });
    
            if (!product) {
                return res.status(404).json({ message: 'Товар не найден' });
            }
            
            let productId = product.id;
            const productInfoList = await ProductInfo.findAll(
                {
                    where: {productId}
                }
            )     
           
            if (productInfoList.length > 0) {
                await Promise.all(productInfoList.map(async (productInfo) => {
                    await productInfo.destroy();
                }));
            }
               
            await product.destroy()

            await BasketProduct.destroy({
                where: {
                  productId: product.id
                },
              });
    
            return res.json({ message: 'Товар успешно удален' });
        } catch (error) {
            return res.status(500).json({ message: 'Возникла ошибка при удалении товара' });
        }
    }

    async update(req, res, next) {
        try {
          const { id } = req.params;
          let { name, price, brandId, typeId, info } = req.body;
          
          const product = await Product.findOne({
            where: { id },
          });
      
          if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }
      
          const img = req.file;
      
          product.name = name;
          product.price = price;
          product.brandId = brandId;
          product.typeId = typeId;
      
          if (img) {
            const fileName = uuid.v4() + '.jpg';
            const uploadPath = path.resolve(__dirname, '..', 'static', fileName);
      
            await fsPromises.rename(img.path, uploadPath);
      
            if (product.img) {
              const filePath = path.resolve(__dirname, '..', 'static', product.img);
              await fsPromises.unlink(filePath).catch(console.error);
            }
      
            product.img = fileName;
          }
      
          await product.save();
      
          if (info) {
            info = JSON.parse(info);
            await ProductInfo.destroy({ where: { productId: product.id } });
      
            for (const i of info) {
              await ProductInfo.create({
                title: i.title,
                description: i.description,
                productId: product.id,
              });
            }
          }
      
          return res.json(product);
        } catch (e) {
          next(ApiError.badRequest(e.message));
        }
      }
}

module.exports = new ProductController()