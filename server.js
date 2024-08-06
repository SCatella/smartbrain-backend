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

// const findUser = (res, id) => {
//   let found = false;

//   database.users.forEach((user, index) => {
//     if (user.id === id) {
//       found = true;
//       return index;
//     }
//   })
//   if (!found) {
//     return res.json();
//   }
// }

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
      res.status(400).json('error logging in.')
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
  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    return res.json();
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;

  database.users.forEach((user, index) => {
    if (user.id === id) {
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if (!found) {
    return res.json();
  }
})

app.listen(port, () => {
  console.log('app is running on port 3000...')
})