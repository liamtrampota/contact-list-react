const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {type: String, required: true},
  phone: {type: Number, required: true},
  birthday: {type: Date, required: true}
})

const Contacts = mongoose.model('Contacts', contactSchema);

module.exports = Contacts
