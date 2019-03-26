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

//arrays for storage
let deviceArr = [];

//automatically sign user out for testing purposes
// firebase.auth().signOut();

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
    console.log("You are logged in.")
    console.log("UID: " + fireBaseUser.uid);
    let uid = fireBaseUser.uid; 
    //get a reference to the database
    let database = firebase.database();
    let ref = database.ref("users/").child(uid).child("devices"); 
    let data = await ref.on("value");
    currentDevice = Object.keys(data.val())[0];
    console.log("current device: " + currentDevice);
    

    // let deviceRef = database.ref("devices/").child(retrievedValue);
    // deviceRef.on("value", getData2);
    
  }
  else
    console.log("You are not logged in.");
});


function getData(data)
{ 
  currentDevice = Object.keys(data.val())[0];
  console.log("current device: " + currentDevice); 
}

function gotData2(data)
{ 
  console.log("current device: " + data.val());
}

function errData(error)
{
  console.log("Error!");
  console.log(error);
}
