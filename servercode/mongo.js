const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOURI)

mongoose.connection.once('open', () => {
  console.log(`Mongo is running`)
})