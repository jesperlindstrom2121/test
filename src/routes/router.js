/**
 * The routes.
 *
 */

 import express from 'express'
 import { router as tasksRouter } from './user-router.js'
 import { router as statsRouter } from './fish-router.js'
 import { router as hookRouter } from './hook-router.js'
 import bodyParser from 'body-parser'

 export const router = express.Router()
 

 router.use('/api/auth', tasksRouter)
 
 router.use('/api', statsRouter) //

 // Webhook: Create a route for the hook
router.use('/webhook', hookRouter)


 router.use('*', (req, res, next) => {
   const error = new Error()
   error.status = 404
   error.message = 'Not Found'
   next(error)
 })
 