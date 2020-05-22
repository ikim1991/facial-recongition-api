const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid Email")
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  },
  entries: {
    type: Number,
    default: 0
  },
  joined: {
    type: Date,
    default: new Date()
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamp: true
})

userSchema.methods.generateAuthToken = async function(){
  const user=this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await Users.findOne({ email })

  if(!user){
    throw new Error("Unable to Log In...")
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    throw new Error("Unable to Log In...")
  }

  return user

}

userSchema.pre("save", async function(next) {
  const user = this
  if(user.isModified("password")){
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})


const Users = mongoose.model("Users", userSchema)

module.exports = Users
