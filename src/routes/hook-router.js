import express from 'express'
import { StatsController } from '../controllers/stats-controller.js'
import { HookController } from '../controllers/hook-controller.js'
import createError from 'http-errors'

import jwt from 'jsonwebtoken'

export const router = express.Router()

const tasksController = new StatsController()
const controller = new HookController()

const authenticateJWT = (req, res, next) => {
  const authorization = req.headers.authorization?.split(' ')

  if (authorization?.[0] !== 'Bearer') {
    next(createError(401))
    return
  }

  try {
    const payload = jwt.verify(authorization[1], process.env.ACCESS_TOKEN_SECRET)

    console.log(payload, 'payload')
    req.user = {
      email: payload.sub,
      firstName: payload.given_name,
      lastName: payload.family_name,
      permissionLevel: payload.x_permission_level
    }

    next()
  } catch (err) {
    console.log(err)
    next(createError(403))
  }
}
// Map HTTP verbs and route paths to controller actions.
router.post('/issue', authenticateJWT, controller.create)
router.get('/issue/:id', authenticateJWT, controller.getUser)
