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
let whiteList = [];
//add a realtime authentication listener
firebase.auth().onAuthStateChanged(fireBaseUser => {
  if(fireBaseUser)
  {
    console.log(fireBaseUser);
    //window.location = "/index";
    // alert("You are logged in.")
    // alert("UID: " + fireBaseUser.uid);
    
    let uid = fireBaseUser.uid; 
    //get a reference to the database
    let database = firebase.database();
    //get a data snapshot of the users devices
    let ref = database.ref("users").child(uid).child("devices"); 
    /* 
      This block of code includes a nested query. First we retrieve
      the device ID, then we use that device ID inside the nested
      query which retrives the whitelist entry corresponding to the
      specific device. We repeat this process for every device the
      user has.  
    */
    ref.once("value")
    //query device list
    .then(function(data){
      currentDevice = Object.keys(data.val())[0];
      console.log("current device: " + currentDevice); 
      let deviceRef = database.ref("devices/").child(currentDevice).child("whitelist_entries");
      deviceRef.once("value")
      //nested query for whitelist entries  
      .then(function(snap){
        snap.forEach(function(childSnapshot) {
          var entryName = childSnapshot.val();
          whiteList.push(entryName); 
        });
        //print array for testing purposes
        whiteList.forEach(function(entryName) {
          console.log(entryName);
        });
      })   
    })
  }
  else
    console.log("You are not logged in.");
});




function getData(data, callback)
{ 
  currentDevice = Object.keys(data.val())[0];
  console.log("current device: " + currentDevice); 
  return (callback);
}


function errData(error)
{
  console.log("Error!");
  console.log(error);
}

