require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')
  

const app = express();
const port = 3000;

const saltRounds = 10;

const databaseAccessKey = process.env.DATABASE_PASSWORD;

const database = knex ({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: databaseAccessKey,
    database: 'smartbrain'
  }
});

database.select('*').from('users').then(data => {
  console.log(data);
})

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


const findUser = (value) => {
  let package = {
    userValid: false,
    responseCode: 400,
    errorMessage: 'User not found.',
    userIndex: -1,
    user: {}
  };

  for (let index = 0; index < database.users.length; index++) {
    const user = database.users[index];

    if (value === user.id || (value.email === user.email && value.password === user.password)) {
      package = {
        userValid: true,
        responseCode: 200,
        errorMessage: '',
        userIndex: index,
        user: user
      }

      return package;
    }
  }
  
  return package;
}

const newUser = ({ name, email, password }) => {  
  const user = {
    id: '12' + database.users.length,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  }
  database.users.push(user);
}

const updateUserEntries = (userIndex) => {
  const user = database.users[userIndex];
  
  user.entries++;
  return user;
}

// BCRYPT for Password Security


// Routes listed below.

// Home:
app.get('/', (req, res) => {
  res.send(database.users);
})

// Sign In:
app.post('/signin', (req, res) => {
  const { name, email, password } = req.body;
  const loginInformation = { name, email, password };

  const userPackage = findUser(loginInformation);

  res.json(userPackage);
})

// Register New User:
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const userInformation = { name, email, password };
  const userPackage = findUser(userInformation);

  if (!userPackage.userValid) {
    newUser(userInformation);
    res.json(findUser(userInformation));
  } else {
    const errorPackage = {
      userValid: true,
      responseCode: 400,
      errorMessage: 'User already exists'
    }

    res.json(errorPackage);
  }
})

// Pull Profile Information On ID:
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  
  if (findUser(id).userValid === true) {
    res.send(findUser(id));
  } else {
    res.status(400).json('User not found.');
  }
})

// Update User Entries Counter:
app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = findUser(id);
  const entriesUpdater = updateUserEntries(user.userIndex);
  
  res.json(entriesUpdater.entries);
})

// Run Server:
app.listen(port, () => {
  console.log('app is running on port 3000...')
})