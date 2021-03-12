
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
const userName = document.getElementById("user-name");
const userPassConf = document.getElementById("user-confirm-password");
const userEmail = document.getElementById("user-email");
const userPass = document.getElementById("user-password");
const loginBtn = document.getElementById("login-btn");

const signUpBtn = document.getElementById("signup-btn");

let database = firebase.database();

//automatically sign user out of current account
firebase.auth().signOut();

//Add event for sign up button
signUpBtn.addEventListener("click", function(){
  let uEmail = userEmail.value;
  let uPassword = userPass.value;
  let confPassword = userPassConf.value;
  let uName = userName.value;
  //create user account
  if(confPassword == uPassword)
  {
    let promise = firebase.auth().createUserWithEmailAndPassword(uEmail, uPassword);
    promise.catch(e => console.log(e.message));
  }
  else
    alert("The passwords do not match");
});
let whiteList = [];

//add a realtime authentication listener
firebase.auth().onAuthStateChanged(fireBaseUser => {
  if(fireBaseUser)
  { 
    let uid = fireBaseUser.uid; 
    let database = firebase.database();

    let userRef = database.ref("users").child(uid);
    userRef.set({
        devices: "none",
        email: userEmail.value,
        name: userName.value,
        uid: uid
    });
    console.log(fireBaseUser);
    window.location = "/index";
    // alert("You are registered.")
    // alert("UID: " + fireBaseUser.uid);
  }
  else
    console.log("You are not logged in.");
});