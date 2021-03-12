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

//arrays to store database information 
let devices = [];
let deviceNames = [];
let accounts = [];
let childrenNames = [];
let childProfiles = []; 

//useful variables
let thisAccount = "";
let printHead = ""; 
let printEntries = "";
let deleteData = ""; 
let index = 0;
let lastDevice = false; 
let androidDevice = false;
let hasAndroid = false;

//first, make sure user is logged in 
firebase.auth().onAuthStateChanged(fireBaseUser => {
    
    if(!fireBaseUser)
    {
        window.location = "\login";
        setTimeout(3000);
    }
    else
    {  
        let uid = fireBaseUser.uid; 
        let database = firebase.database();

        //get a data snapshot of the users devices
        let ref = database.ref("users").child(uid).child("devices"); 
        ref.once("value").then(function(data){

            devices = Object.entries(data.val());
            printEntries = "<table class='table table-striped'>"
            + "<thead class='thead'>"
            + "<tr>"
            + "<th scope='col'>Device Name</th>"
            + "<th scope='col'></th>"
            + "</tr>"
            + "</thead>"
            + "<tbody>";

            //send each device entry to HTML
            devices.forEach(function(device){

                //data attribute for delete button
                deleteData = "id='device-delete-btn'"
                + "data-deviceID = '" + device[0] + "'"

                printEntries += "<tr>" 
                + "<td>"+device[1]+"</td>"
                //begin delete button
                + "<td><button type='button' class='btn btn-secondary btn-sm'"
                + deleteData
                + ">Delete</button></td>"
                //end delete button
                + "</tr>";
            });
            printEntries += "</tbody></table>";
            document.getElementById('device-table').innerHTML += printEntries;
            
            //event listener for windows delete buttons 
            $(document).on('click','#device-delete-btn',function(){
                console.log("delete button clicked...");
                let deviceID = $(this).attr('data-deviceID');
                console.log("deviceID:" + deviceID);
                console.log("uid:" + uid);
                removeDevice(database, deviceID, uid);
                $(this).closest('tr').remove();
            });
        });
    }
})

//function to remove a specified whitelist entry
function removeDevice(db, deviceID, userID)
{   
    //first remove the device from Users node
    ref = db.ref("users").child(userID).child("devices").child(deviceID);
    ref.remove().then(function() {
        console.log("Device successfully removed from Users node.")
    })
    .catch(function(error) {
        console.log("Device removal from Users failed: " + error.message)
    });

    //next remove device from Devices node
    ref = db.ref("devices").child(deviceID);
    ref.remove().then(function() {
        console.log("Device successfully removed from Devices node.")
    })
    .catch(function(error) {
        console.log("Device removal from Devices failed: " + error.message)
    });
}


devices = Object.entries(data.val());
    printEntries = "<table class='table table-striped'>"
    + "<thead class='thead'>"
    + "<tr>"
    + "<th scope='col'>Childs Name</th>"
    + "<th scope='col'></th>"
    + "</tr>"
    + "</thead>"
    + "<tbody>";

    //send each device entry to HTML
    devices.forEach(function(device){

        //data attribute for delete button
        deleteData = "id='device-delete-btn'"
        + "data-deviceID = '" + device[0] + "'"

        printEntries += "<tr>" 
        + "<td>"+device[1]+"</td>"
        //begin delete button
        + "<td><button type='button' class='btn btn-secondary btn-sm'"
        + deleteData
        + ">Delete</button></td>"
        //end delete button
        + "</tr>";
});