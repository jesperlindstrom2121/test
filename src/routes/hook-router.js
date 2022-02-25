import express from 'express'
import { FishController } from '../controllers/fish-controller.js'
import { HookController } from '../controllers/hook-controller.js'
import createError from 'http-errors'

import jwt from 'jsonwebtoken'

export const router = express.Router()

const tasksController = new FishController()
const controller = new HookController()

const authenticateJWT = (req, res, next) => {
  const authorization = req.headers.authorization.split(' ')

  if (authorization[0] !== 'Bearer') {
    next(createError(401))
    return
  }

  try {
    const payload = jwt.verify(authorization[1], process.env.ACCESS_TOKEN_SECRET)

    console.log(payload, 'payload')
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
// Map HTTP verbs and route paths to controller actions.
router.post('/', authenticateJWT, controller.create)
router.get('/:id', authenticateJWT, controller.getUser)
