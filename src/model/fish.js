

 import mongoose from 'mongoose'

 // Create a schema.
 const fishCatch = new mongoose.Schema({
   name: {
     type: String,
     minilength:1,
     require: true
   },
   lake: {
     type: String,
     minlength: 1,
     required: true
   },
   city: {
     type: String,
     minilength: 1,
     reguired: true
   },
   weight: {
     type: String
 
   },
   length: {
    type: String,
    minilength: 1,
    reguired: true
  },
 }, {
   timestamps: true
 })
 
 export const Catch = mongoose.model('catch', fishCatch)
 