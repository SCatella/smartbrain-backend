const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

const saltRounds = 10;


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

let database = {
  users: [
    {
      id: '120',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '121',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'apples',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: 987,
      hash: '$2b$10$6Jppb9PvKXohHO0gsmee1.VXFH4sQQp.AewifecTO5ArDn7NSV522',
      email: 'john@gmail.com'
    },
    {
      id: 988,
      hash: '$2b$10$7LbtayCyOwOcxLuLg8zCneWLfLhxL5FIv2w3aSUK5eiGuOvsdd1Kq',
      email: 'sally@gmail.com'
    }
  ]
}

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

const newUser = (name, email, password) => {
  database.users.push({
    id: '12' + database.users.length++,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
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
  const loginInformation = {
    email: req.body.email,
    password: req.body.password
  };
  const userPackage = findUser(loginInformation);

  res.json(userPackage);
})

// Register New User:
app.post('/register', (req, res) => {
  const { name, email } = req.body;
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const password = hash;
    return password;
  })
  const userPackage = findUser({ email: email, password: password });

  if (!userPackage.userValid)
    {
      newUser(name, email, password);
      res.json(database.users[database.users.length - 1]);
    } else
    {
      res.json('User already exist.');
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
  
  res.send(entriesUpdater);
})

// Run Server:
app.listen(port, () => {
  console.log('app is running on port 3000...')
})