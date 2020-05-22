const express = require('express');
const usersRouter = require("./routers/users")
const cors = require('cors');
require('./db/mongoose');

const app = express()

app.use(express.json())
app.use(cors())
app.use(usersRouter)

const port = process.env.PORT

app.listen(port, () => {
  console.log("Listening on PORT " + port)
})
