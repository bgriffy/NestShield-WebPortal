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
let whiteList = [];
let devices = [];
let accounts = [];
let childrenNames = [];

firebase.auth().onAuthStateChanged(fireBaseUser => {
    if(!fireBaseUser)
    {
        window.location = "\login";
        setTimeout(3000);
    }
    else
    {
        /* 
        This block of code includes a nested query. First we retrieve
        the device ID, then we use that device ID inside the nested
        query which retrives the whitelist entry corresponding to the
        specific device. We repeat this process for every device the
        user has.  
        */
        console.log("You are logged in.");
        let uid = fireBaseUser.uid; 
        let database = firebase.database();

        //get a data snapshot of the users devices
        let ref = database.ref("users").child(uid).child("devices"); 
        ref.once("value").then(function(data){
            devices = Object.keys(data.val());
            
            //loop through each device
            devices.forEach(function(currentDevice){
                console.log("current device from loop: " + currentDevice);
                
                //get a data snapshot of the accounts associated with the device 
                let childRef = database.ref("devices/").child(currentDevice).child("accounts")
                childRef.once("value").then(function(childData){

                    //get list of the accounts
                    accounts = Object.keys(childData.val());

                    let childName = database.ref("devices/").child(currentDevice).child("accounts/")
                    .child(accounts[0]).child("ProfileName");
                    //get a data snapshot of the children 
                    childName.once("value").then(function(nameData){
                        let thisName = nameData.val();
                        childrenNames.push(thisName);
                        childrenNames.forEach(function(childName){
                            //construct headers for tabs here using child names
                            });

                            //get the whitelist entries 
                            let deviceRef = database.ref("devices/").child(currentDevice).child("accounts/")
                            .child(accounts[0]).child("whitelist_entries");
                            deviceRef.once("value").then(function(snap){
                                snap.forEach(function(childSnapshot) {
                                let entryName = childSnapshot.val();
                                whiteList.push(entryName); 
                                
                                //send whitelist to HTML
                                let printEntries ="<div class ='wl-table'>"
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
                            });  
                        });
                    });
                });
            });
        });   
    }
});