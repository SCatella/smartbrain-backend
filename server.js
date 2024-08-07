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

const findUser = (idNumber) => {
  const userId = Number(idNumber);
  let response = {
    userValid: false,
    userIndex: 0,
    user: {}
  };

  if (Number.isInteger(userId)) {
    database.users.forEach((user, index) => {
      if (userId === user.id) {
        response.userValid = true;
        response.userIndex = index;
        response.user = user;
      }
    })
  }
  return response;
}

const updateUserEntries = (userIndex) => {
  const user = database.users[userIndex];
  
  user.entries++;
  return user;
}


// Routes listed below.
app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password)
    {
      res.json('success');
    } else
    {
      res.status(400).json('Error logging in.')
    }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (req.body.name !== database.users[0].name &&
      req.body.email !== database.users[0].email)
  {
    database.users.push({
      id: Number('12' + database.users.length++),
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
    })
    res.json(database.users[database.users.length-1])
  } else
  {
    res.json('user already exists.')
  }
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  
  if (findUser(id).userValid === true) {
    res.send(findUser(id));
  } else {
    res.status(400).json('User not found.');
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = findUser(id);
  const entriesUpdater = updateUserEntries(user.userIndex);
  
  res.send(entriesUpdater);
})

app.listen(port, () => {
  console.log('app is running on port 3000...')
})