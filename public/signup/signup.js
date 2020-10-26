async function signUp() { 
  const firstName = document.getElementById('first').value;
  const lastName = document.getElementById('last').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (document.getElementById('confirm').value != password) {
    document.getElementById('err').textContent = "Passwords don't match!";
    return;
  }
  if (firstName == "" || username == "" || email == "" || password == "") {
    document.getElementById('err').textContent = "All fields but last name are required!";
    return;
  }
  const data = { firstName, lastName, username, email, password };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const response = await fetch('/signup',options);
  const json = await response.json();
  if (json.status == 'failure') {
    document.getElementById('err').textContent = json.reason;
    return;
  }
  sessionStorage.setItem("loggedIn",true);
  sessionStorage.setItem("user",user);
  window.location.replace("/");
  document.getElementById('err').textContent = "";
  console.log(json);
}