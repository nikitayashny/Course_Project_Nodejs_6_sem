const Router = require('express')
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', checkRole('ADMIN'))

module.exports = router