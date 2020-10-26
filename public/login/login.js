var page = sessionStorage.getItem("page") || "";
var loggedIn = sessionStorage.getItem("loggedIn") || false;
if (loggedIn) window.location.replace(`/${page}`);
async function logIn() {
  const user = document.getElementById('user').value;
  const pass = document.getElementById('password').value;
  const data = { user, pass };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const response = await fetch('/login',options);
  const json = await response.json();
  console.log(json);
  if (json.status == 'success') {
    console.log('Congratulations!');
    sessionStorage.setItem("loggedIn",true);
    sessionStorage.setItem("user",user);
    window.location.replace(`/${page}`);
  }
  if (json.status == 'failure') {
    document.getElementById('err').textContent = json.reason;
  }
}