const express = require('express');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

let database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send('this is working');
})

app.post('/signin', (req, res) => {
  if (
      req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password
    )
    {
      res.json('success');
  } else {
    res.status(400).json('error logging in.')
    }
})

app.post('/register', (req, res) => {
  res.send('register');
})

app.listen(port, () => {
  console.log('app is running on port 3000...')
})

/*

  / --> res = this is working
  /signin --> POST res = success || fail
  /register --> POST res = user{}
  /profile/:userId --> GET = user{}
  /image --> PUT res user{count:}

*/