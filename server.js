const express = require('express');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

let database = {
  users: [
    {
      id: 120,
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: 121,
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
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

  database.users.forEach((user, index) => {
    if (Number(value) === user.id || (value.email === user.email && value.password === user.password)) {
      package = {
        userValid: true,
        responseCode: 200,
        errorMessage: '',
        userIndex: index,
        user: user
      }
    }
  })
  
  return package;
}

const newUser = (name, email, password) => {
  database.users.push({
    id: 120 + database.users.length++,
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

  if (userPackage.userValid)
    {
      res.json('success');
    } else
    {
      res.status(userPackage.responseCode).json(userPackage.errorMessage);
    }
})

// Register New User:
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const userPackage = findUser({ email: req.body.email, password: req.body.password });

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