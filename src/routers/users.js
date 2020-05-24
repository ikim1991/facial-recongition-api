const express = require("express")
const router = new express.Router()
const bcrypt = require('bcryptjs')
const Users = require('../models/users')
const auth = require('../middleware/auth')

router.get('/user', auth, async (req, res) => {
  const users = await Users.findOne({ _id: req.user._id, email: req.user.email })
  res.send(users)
})

router.post('/signin', async (req, res) => {
  try{
    const user = await Users.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({user, token})
  } catch(error){
    res.status(400).send({error: 'Username and Password not Found...'})
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

router.post("/logout", auth, async (req, res) => {
  try{
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send({})
  } catch(error){
    res.status(500).send()
  }
})

router.put("/image", auth, async (req, res) => {
  console.log(req.user)
  if(req.user){
    req.user.entries++
    console.log(req.user.entries)
    await req.user.save()
    return res.send(req.user)
  }
  res.status(404).send({error: "User Not Found..."})
})

module.exports = router
