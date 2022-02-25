/**
 * Hook issues.
 */
 import jwt from 'jsonwebtoken'
 import { Hooks } from '../model/hook.js'
 export class HookController { // Class.
  /**
   * Recieves a Webhook, validates it and sends it to Tasks Create Controller.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    req.body = {
      iid: req.body.object_attributes.iid,
      description: req.body.object_attributes.title,
      done: false,
      state: req.body.object_attributes.state,
      action: req.body.object_attributes.action
    }
    next()
  }

  async create (req, res, next) {
    try {
      
      let {url} = req.body

      const authorization = req.headers.authorization?.split(' ')
      const payload = jwt.verify(authorization[1], process.env.ACCESS_TOKEN_SECRET)
      let hook = new Hooks({
        userId: payload.id, 
        url: url
      })

      await hook.save()
      res.send(201, hook)

    } catch (error) {
      console.log(error)
     
    }
  }

  async getUser (req, res, next){

    let id = req.params.id
    const authorization = req.headers.authorization?.split(' ')
      const pay = jwt.verify(authorization[1], process.env.ACCESS_TOKEN_SECRET)

      let hook = await Hooks.findOne({_id : id})

      if(id == hook.id){
        res.send(hook)
      }

  }
}
