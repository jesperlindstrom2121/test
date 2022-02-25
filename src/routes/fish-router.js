import express from 'express'

import { FishController } from '../controllers/fish-controller.js'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

export const router = express.Router()

const controller = new FishController()

const authenticateJWT = (req, res, next) => {
  const authorization = req.headers.authorization.split(' ')

  if (authorization[0] !== 'Bearer') {
    next(createError(401))
    return
  }

  try {
    const payload = jwt.verify(authorization[1], process.env.ACCESS_TOKEN_SECRET)

    req.user = {
      email: payload.sub,
      permissionLevel: payload.x_permission_level
    }

    next()
  } catch (err) {
    console.log(err)
    next(createError(403))
  }
}

router.get('/', controller.greeting)
router.get('/fish', controller.index)
router.post('/fish', authenticateJWT, controller.create)
//router.get('/add', authenticateJWT, controller.index) 
router.get('/fish/:id', authenticateJWT,controller.find)
router.put('/fish/:id', authenticateJWT,controller.update)
router.delete('/fish/:id', authenticateJWT,controller.delete)



