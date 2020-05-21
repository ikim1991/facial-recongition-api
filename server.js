const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors')

const app = express()

const database = {
  users: [
    {
      id: 0,
      name: 'John',
      email: 'john@gmail.com',
      password: '$2a$10$VqsNTYeg.DjHhZSoQ2eGy.GAJILe263kxgPgOvCuUA96WoI74Nr/6',
      entries: 0,
      joined: new Date()
    },
    {
      id: 1,
      name: 'Sally',
      email: 'sally@gmail.com',
      password: '$2a$10$bbiQnOamt54PLEzSKvqe2O5Y2do9nPbc9V04.FmIn.Zz/O3elk2Tm',
      entries: 0,
      joined: new Date()
    },
  ]
}


app.use(express.json())
app.use(cors())

const port = process.env.PORT

app.get('/', (req, res) => {
  res.send(database.users)
})

app.post('/signin', (req, res) => {
  const user = database.users.find(user => req.body.email === user.email)
  if(user){
    bcrypt.compare(req.body.password, user.password, (error, response) => {
      if(response){
        return res.send(user)
      }
    })
  } else{
    res.send({error: "User Not Found..."})
  }

})

app.post('/register', (req, res) => {

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        const new_user = {
          id: database.users.length,
          name: req.body.name,
          email: req.body.email,
          password: hash,
          entries: 0,
          joined: new Date()
        }

        database.users.push(new_user)
        return res.status(201).send(new_user)
      })
  })

})

app.get("/profile/:id", (req, res) => {
  const _id = req.params.id
  const user = database.users.find(user => user.id == _id)
  if(user){
    return res.send(user)
  }
  res.status(404).send({error: "User Not Found..."})
})

app.put("/image", (req, res) => {
  const _id = req.body.id
  const user = database.users.find(user => user.id == _id)
  if(user){
    user.entries++
    return res.send(user)
  }
  res.status(404).send({error: "User Not Found..."})
})

app.listen(port, () => {
  console.log("Listening on PORT " + port)
})
