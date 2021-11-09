const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const port = 3000

app.get('/', (req, res) => {
  res.send('My Login API')
})

app.post('/api/login', (req, res) => {
  console.log(req.body)
  if (req.body.id === 'user' && req.body.pw === '123') {
    res.send({ msg: 'OK' })
  } else {
    res.send({ msg: 'NO' })
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})