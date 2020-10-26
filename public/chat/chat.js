sessionStorage.setItem("page","chat");
var loggedIn = sessionStorage.getItem("loggedIn") || false;
var user = sessionStorage.getItem("user") || null;
if (!loggedIn) window.location.replace("/login");
const sock = io();
var room = 'default';
sock.emit('choose',{user: user, to: room, from: null});

const writeEvent = (message) => {
  const parent = document.getElementById('feed');
  const el = document.createElement('li');
  el.className = "them";
  el.textContent=`${message.user}: ${message.text}`;
  parent.appendChild(el);
  const chat = document.getElementById('feed-wrapper');
  chat.scrollTop = chat.scrollHeight;
};

const joinRoom = (event) => {
  event.preventDefault();
  //user = document.getElementById('user').value;
  newRoom = document.getElementById('room').value;
  console.log('Room joined.');
  sock.emit('choose',{ user: user, to: newRoom, from: room });
  room = newRoom;
}

const sendMessage = (event) => {
  event.preventDefault();
  const input = document.querySelector('#message');
  const text = input.value;
  input.value = '';
  sock.emit('message',{user: user, text: text, room: room});
  const parent = document.getElementById('feed');
  const el = document.createElement('li');
  el.className = "me";
  el.textContent=text;
  parent.appendChild(el);
  const chat = document.getElementById('feed-wrapper');
  chat.scrollTop = chat.scrollHeight;
  //console.log(`top: ${chat.scrollTop}, height: ${chat.scrollHeight}`);
}

sock.on('message',writeEvent);

document.getElementById('name').addEventListener('submit', joinRoom);
document.getElementById('chat').addEventListener('submit', sendMessage);
