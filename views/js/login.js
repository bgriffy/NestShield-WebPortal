(function()
{
//Initialize Firebase
  var config =
  {
        apiKey: "AIzaSyDPV0qhojTJLNdFzMkAIJvkoMaV0I0uPbo",
        authDomain: "nestshield-4fd1e.firebaseapp.com",
        databaseURL: "https://nestshield-4fd1e.firebaseio.com",
        projectId: "nestshield-4fd1e",
        storageBucket: "nestshield-4fd1e.appspot.com",
        messagingSenderId: "414283233"
  };
  firebase.initializeApp(config);
})();

//Get elements from DOM
const userEmail = document.getElementById("user-email");
const userPass = document.getElementById("user-password");
const loginBtn = document.getElementById("login-btn");
const signUpBtn = document.getElementById("signup-btn");

//automatically sign user out for testing purposes
firebase.auth().signOut();

//Add event for login button
loginBtn.addEventListener("click", function(){
  let uEmail = userEmail.value;
  let uPassword = userPass.value;
  //log the user in
  let promise = firebase.auth().signInWithEmailAndPassword(uEmail, uPassword);
  promise.catch(e => console.log(e.message));
});

let whiteList = [];

//add a realtime authentication listener
firebase.auth().onAuthStateChanged(fireBaseUser => {
  if(fireBaseUser)
  {
    console.log(fireBaseUser);
    window.location = "/index";
    // alert("You are logged in.")
    // alert("UID: " + fireBaseUser.uid);
  }
  else
    console.log("You are not logged in.");
});