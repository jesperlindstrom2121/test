import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'morgan'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import bodyParser from 'body-parser'

/**
 * The main function of the application.
 */
const main = async () => {
  await connectDB()

  
  const app = express()
  const baseURL = process.env.BASE_URL || "/"

  app.set('port', (process.env.PORT || 5000))
  app.use(helmet())
  app.use(cors())

  app.use(logger('dev'))
  app.use(bodyParser.urlencoded({ extended: false}))
  app.use(bodyParser.json())
  
  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500

    if (req.app.get('env') !== 'development') {
      res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
      return
    }

    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message,
        innerException: err.innerException,
        stack: err.stack
      })
  })

  // Starts the HTTP server listening for connections.
  app.listen(app.get('port'), function() {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
}

main().catch(console.error)
