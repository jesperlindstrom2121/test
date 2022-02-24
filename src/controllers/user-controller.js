import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { User } from '../model/user.js'

/**
 * Account controller.
 */
export class UserController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @param {Function} next - Next middleware.
   */
  async login (req, res, next) {
    try {
      const user = await User.authenticate(req.body.email, req.body.password)

      const payload = {
        sub: user.email,
        x_permission_level: user.permissionLevel
      }

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '15m'
      })

      res
        .status(201)
        .json({
          access_token: accessToken
        })
    } catch (error) {
      const err = createError(401)
      err.innerException = error

      next(err)
    }
  }

  /**
   * Registera en användare.
   *
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @param {Function} next - Next middleware.
   */
  async register (req, res, next) {
    try {
      const user = await User.insert({
        email: req.body.email,
        password: req.body.password,
        permissionLevel: 1
      })

      res
        .status(201)
        .json({ id: user.id })
    } catch (error) {
      let err = error

      if (err.code === 11000) {
        err = createError(409)
        err.innerException = error
      } else if (error.name === 'ValidationError') {
        err = createError(400)
        err.innerException = error
      }

      next(err)
    }
  }
}
