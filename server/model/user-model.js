const mongoose = require('pg')
const Schema = mongoose.Schema

const User = new Schema(
    {
        mail: { type: String, required: true },
        name: { type: String, required: true },
        password: { type: String, required: false },
        status: { type: String, required: false },
    },
)

module.exports = mongoose.model('user', User)