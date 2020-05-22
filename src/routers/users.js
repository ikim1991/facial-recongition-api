const express = require("express")
const router = new express.Router()
const bcrypt = require('bcryptjs')
const Users = require('../models/users')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  const users = await Users.find({})
  res.send(users)
})

router.post('/signin', async (req, res) => {
  try{
    const user = await Users.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({user, token})
  } catch(error){
    res.status(400).send()
  }
})

router.post('/register', async (req, res) => {
  const user = new Users(req.body)

  try{
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch(error){
    res.status(400).send()
  }
})

router.get("/profile/:id", (req, res) => {
  const _id = req.params.id
  const user = database.users.find(user => user.id == _id)
  if(user){
    return res.send(user)
  }
  res.status(404).send({error: "User Not Found..."})
})

router.put("/image", (req, res) => {
  const _id = req.body.id
  const user = database.users.find(user => user.id == _id)
  if(user){
    user.entries++
    return res.send(user)
  }
  res.status(404).send({error: "User Not Found..."})
})

module.exports = router
