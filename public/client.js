sessionStorage.setItem("page","");
var loggedIn = sessionStorage.getItem("loggedIn") || false;
var user = sessionStorage.getItem("user") || null;
if (!loggedIn) window.location.replace("/login");
var video;
function setup(){
  getData();
  noCanvas();
  console.log(loggedIn);
  console.log(user);
  //video = createCapture(VIDEO);
  //video.size(320,240);
}
async function postData() { 
  const firstName = document.getElementById('first').value;
  const lastName = document.getElementById('last').value;
  //video.loadPixels(); //creates a canvas for vid
  //const image = video.canvas.toDataURL(); //encodes to base64
  const data = { firstName, lastName/*, image*/ };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const response = await fetch('/api',options);
  const json = await response.json();
  console.log(json);
}
async function getData() {
  const response = await fetch('/api');
  const data = await response.json();
  for (item of data) {
    const root = document.createElement('div');
    const name = document.createElement('div');
    //const image = document.createElement('img');

    name.textContent = `name: ${item.firstName} ${item.lastName}`;
    //image.src = item.image;
    root.append(name/*,image*/);
    document.body.append(root);
  }
  console.log(data);
}