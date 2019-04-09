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

//array used to store whitelist entries
let whiteList = [];
firebase.auth().onAuthStateChanged(fireBaseUser => {
  if(!fireBaseUser)
  {
    window.location = "\login";
    setTimeout(3000);
  }
  else
  {
    console.log("You are logged in.");
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
        
        let printEntries ="<div class ='wl-table w-50'>"
        + "<table class='table'>"
        + "<thead class='thead-dark'>"
        + "<tr>"
        + "<th scope='col'>Process</th>"
        + "<th scope='col'></th>"
        + "<th scope='col'></th>"
        + "<th scope='col'></th>"
        + "</tr>"
        + "</thead>"
        + "<tbody>";

        whiteList.forEach(function(entryName) {
            printEntries += "<tr>" 
            + "<th scope='row'>"+entryName+"</th>"
            + "<td><button type='button' class='btn btn-secondary btn-sm'>Monitor</button></td>"
            + "<td><button type='button' class='btn btn-secondary btn-sm'>Restrict</button></td>"
            + "<td><button type='button' class='btn btn-secondary btn-sm'>Delete</button></td>"
            + "</tr>";
        });

        printEntries += "</tbody>"
        +"</table>"
        + "</div>"
        document.getElementById("white-list").innerHTML = printEntries;
      })   
    })   
  }
});


