const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const mongoose = require('mongoose')
const Contacts = require('./models.js')
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_URI, function(error) {
  console.log(error);
})

app.get('/ping', function (req, res) {
 return res.send('pong');
});

// DO NOT REMOVE THIS LINE :)
app.get('/', function (req, res) {
  console.log('getting homepage')
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/contacts', function (req, res) {
  console.log('getting contacts');
  var contacts = Contacts.find({}, function(error, results){
    if(error){
      res.send(error);
      console.log(error)
    } else {
      res.send(results);
      console.log(results)
    }
  })
  console.log(contacts)
})

app.post('/contact/new', function (req, res) {
  console.log('posting new contact');
  console.log('req: ', req.body)
  const newContact = new Contacts({
    name: req.body.name,
    phone: req.body.phone,
    birthday: req.body.birthday
  })
  console.log(newContact)
  newContact.save()
    .then(response => {
      console.log(response)
      res.status(200)
    })
    .catch(error => {
      console.log('error')
      res.status(500)
    })
})

app.post('/contact/delete', function (req, res) {
  console.log('deleting contact');
  console.log(req.body)
  Contacts.deleteOne({name: req.body.contact.name, phone:req.body.contact.phone}, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log('deleted')
      res.status(200).send('deleted')
    }
  })
})

app.post('/contact/edit', function (req, res) {
  console.log('editing contact: ', req.body);
  Contacts.updateOne({name: req.body.former.name, phone: req.body.former.phone}, {name: req.body.name, phone:req.body.phone, birthday:req.body.birthday}, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log('edited')
      res.status(200).send('edited')
    }
  })

})

app.listen(process.env.PORT || 1337);
