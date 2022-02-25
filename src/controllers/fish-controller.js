import express from 'express'
import { Catch } from '../model/fish.js'
import { Hooks } from '../model/hook.js'
import fetch from 'node-fetch'
export const router = express.Router()


/**
 * Snippet controller
 */
export class FishController {

  async greeting(req, res, next){
    res.json('hello to my api')
  }
  
  async index(req, res, next) {
    try {
      const viewData = {
        tasks: (await Catch.find({}))
          .map(catched => ({
            name: catched.name,
            lake: catched.lake,
            city: catched.city,
            weight: catched.weight,
            length: catched.length,
            _links: { 
              href: `fishcatch.se:8080/api/fish/${catched.id}`,
              type: 'PUT, DELETE' }
          }))
      }

      console.log(viewData)
      res
        .status(201)
        .json(viewData)

    } catch (error) {
      next(error)
    }
  }

  async create(req, res) {
    try {
      //console.log(req.body)
      const fishCatch = new Catch({
        name: req.body.name,
        lake: req.body.lake,
        city: req.body.bladType,
        weight: req.body.weight,
        length: req.body.length
      })


      await fishCatch.save()

      let result = await Hooks.find()
      console.log(result)
      await Promise.all(result.map(async (i) => {
        console.log(i)
        let p = JSON.stringify(fishCatch)
        console.log(p)
        await fetch(i.url, {
          method: 'post',
          body: p,
        })
      }));
     
      res
        .json(fishCatch)

    } catch (error) {

      console.log(error)
    }
  }

  async find(req, res, next) {

    const fishCatch = await Catch.findById(req.params.id)
    const viewdata = {
      fishCatch, _links: { 
        href: `fishcatch.se:8080/api/fish/`,
        type: 'GET, POST' }
    }
    res.json(viewdata)
  }

  async update(req, res, next) {

    const task = await Catch.findOne({_id: req.params.id})

    req.task = task
      req.task.name = req.body.name
      req.task.lake = req.body.lake
      req.task.city = req.body.city
      req.task.weight = req.body.weight
      req.task.length = req.body.length

      await req.task.save()
   
      console.log(req.task)

    res
    .status(204)
    .end()

  }

  async delete(req, res, next) {

    const task = await Catch.findById(req.params.id)
    console.log(task)
    await task.delete()
    res
        .status(204)
        .end()
  }

}