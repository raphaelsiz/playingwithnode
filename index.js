const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Datastore = require('nedb');

const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 3003;

const server = http.createServer(app);

const io = socketio(server);

io.on('connection',(sock)=>{
  var room;
  var name;
  sock.on('choose', (data) => {
    sock.emit('message',{user: 'Bot', text: `Welcome, ${data.user}!`});
    sock.join(data.to);
    sock.to(data.from).emit('message',{user: 'Bot', text: `${data.user} has left the room.`});
    sock.to(data.to).emit('message',{user: 'Bot', text: `${data.user} has joined the room.`});
    console.log(`${data.user} has joined ${data.to} from ${data.from}.`);
    room = data.to;
    name = data.user;
  });
  console.log('Someone connected!');

  sock.on('start',(room)=> {
    console.log(`Game started in ${room}`);
    const array = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    io.in(room).emit('game',array);
  });
  sock.on('message',(message) => {
    console.log(`User: ${name}. Message: ${message.text}. Room: ${room}`);
    sock.to(message.room).emit('message',message);
  });

  sock.on('disconnect',()=>{
    io.emit('message',{user:'Bot',text:`Someone has left.`});
  });
});

server.on('error',(err)=>{
  console.error('Server error: ', err);
});
server.listen(PORT,()=>console.log(`listening at ${PORT}`));

app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api',(req,res) => {
  //res.json({test: 123});
  database.find({},(err,data) => {
    if (err) {
      res.end();
      return;
    }
    res.json(data);
  });
});

app.post('/signup',(req,res) => {
  console.log('Checking data...');
  const data = req.body;
  database.findOne({ username: data.username }, function (err, doc) {
    if (err) {
      res.json({
        status: 'failure',
        reason: 'Server error! Try again.'
      });
      res.end();
      console.log('error');
      return;
    }
    else if (!doc || doc == null){
      database.insert(data);
      res.json({
        status: 'success',
        data: data
      });
      console.log('success');
    }
    else {
      res.json ({
        status: 'failure',
        reason: 'Username already exists.'
      });
    }
  });
  //console.log(data);
});

app.post('/login',(req,res) => {
  //res.json({test: 123});
  const user = req.body.user;
  const pass = req.body.pass;
  database.findOne({username: user},(err,data) => {
    if (err) {
      res.end();
      return;
    }
    if (!data || data==null) {
      res.json({
        status: 'failure',
        reason: 'User does not exist.'
      });
      return;
    }
    if (data.password != pass) {
      res.json({
        status: 'failure',
        reason: 'Wrong password.'
      });
      return;
    }
    res.json({ status: 'success' });
  });
});


app.post('/api',(req,res) => {
  console.log('I got a request!');
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  console.log(data);
  res.json({
    status: 'success',
    timestamp: timestamp,
    data: data
  });
})
