const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')
const multer = require('multer');
const upload = multer({ dest: 'static/' });
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), upload.single('img'), productController.create)
router.get('/', productController.getAll)
router.get('/:id', productController.getOne)
router.delete('/:id', checkRole('ADMIN'), productController.deleteOneByName)
router.put('/:id', checkRole('ADMIN'), upload.single('img'), productController.update)

module.exports = router