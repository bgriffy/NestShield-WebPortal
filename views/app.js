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

//Add event for sign up button
signUpBtn.addEventListener("click", function(){
  let uEmail = userEmail.value;
  let uPassword = userPass.value;
  //create user account
  let promise = firebase.auth().createUserWithEmailAndPassword(uEmail, uPassword);
  promise.catch(e => console.log(e.message));
});

//add a realtime authentication listener
firebase.auth().onAuthStateChanged(fireBaseUser => {
  if(fireBaseUser)
  {
    console.log(fireBaseUser);
    //window.location = "/index";
    alert("You are logged in.")
    alert("UID: " + fireBaseUser.uid);
    let uid = fireBaseUser.uid; 
    //get a reference to the database
    let database = firebase.database();
    let ref = database.ref("users/" + uid).child("devices"); 
    ref.on("value", gotData, errData);
    
  }
  else
    alert("You are not logged in.");
});


function gotData(data)
{ 
  let currentDevice = Object.keys(data.val())[0];
  return(currentDevice);
}

function errData(error)
{
  console.log("Error!");
  console.log(error);
}

