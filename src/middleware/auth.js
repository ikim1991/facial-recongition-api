const jwt = require('jsonwebtoken')
const Users = require('../models/users')

const auth = async (req, res, next) => {
  try{
    console.log(req.header('Authorization'))
    const token = req.header('Authorization').replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    const user = await Users.findOne({ _id: decoded._id })

    console.log(user)
    if(!user){
      throw new Error("Please Authenticate")
    }

    req.token = token
    req.user = user
    next()
  } catch(error){
    res.status(401).send({ error: "Please Authenticate"})
  }
}

module.exports = auth
