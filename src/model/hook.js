import mongoose from 'mongoose'

 // Create a schema.
 const HookSchema = new mongoose.Schema({
   userId: {
     type: String,
     require: true
   },
   url: {
     type: String,
     required: true
   }
 })
 
 export const Hooks = mongoose.model('Hook', HookSchema)
 