const jwt = require('jsonwebtoken')
const Users = require('../models/users')

const auth = async (req, res, next) => {
  try{
    const token = req.header('Authorization').replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = Users.findOne({ _id: decoded._id, "tokens.token": token })

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
