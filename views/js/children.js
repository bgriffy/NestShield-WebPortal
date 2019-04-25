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
let headWritten = false;

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
            
            devices = Object.keys(data.val());
            deviceNames = Object.values(data.val());
            //loop through each device
            devices.forEach(function(currentDevice){
                
                if(index == devices.length-1)
                    lastDevice = true; 
                index++; 

                //----android devices----
                let androidRef = database.ref("devices/").child(currentDevice)
                androidRef.once("value").then(function(snapshot){
                    
                    if (snapshot.hasChild("type")) {
                        androidDevice = true; 
                        //store child profile info into JS object, insert into profile array
                        let childProfile = {
                            profileName: snapshot.child("child_name").val(),
                            deviceName: snapshot.child("child_name").val() + "-Android",
                            deviceID: currentDevice, 
                            deviceType: "android"
                        };
                        
                        childProfiles.push(childProfile);

                        //store childs name into array
                        if(!childrenNames.includes(childProfile.profileName))
                            childrenNames.push(childProfile.profileName);
                        
                        if(lastDevice == false)
                            return; 
                        console.log("currentDevice in Android: " + currentDevice);
                        console.log("deviceID in Android: " + childProfile.deviceID);
                        displayChildren(childrenNames);
                    }
                });

                //----windows devices----
                let windowsRef = database.ref("devices/").child(currentDevice).child("accounts"); 
                windowsRef.once("value").then(function(snapshot){
                    
                    if (snapshot.exists())
                    {   
                        //get list of the accounts
                        accounts = Object.keys(snapshot.val());
                        
                        //loop through each account   
                        accounts.forEach(function(currentAcct){
                            
                            //store child profile info into JS object, insert into profile array
                            let childProfile = {
                                profileName: snapshot.child(currentAcct).child("ProfileName").val(),
                                deviceName: snapshot.child(currentAcct).child("DeviceName").val(),
                                deviceID: currentDevice, 
                                accountID: currentAcct,
                                deviceType: "windows"
                            };
                            
                            childProfiles.push(childProfile);

                            //store childs name into array
                            if(!childrenNames.includes(childProfile.profileName))
                                childrenNames.push(childProfile.profileName);
                        });
                    }

                    if(lastDevice == false)
                        return; 
                    displayChildren(childrenNames);
                });
                
                //event listener for windows delete buttons 
                $(document).on('click','#delete-btn',function(){
                    let childName = $(this).attr('data-childName');
                    console.log("delete button clicked...");
                    console.log("childName: " + childName);
                    removeChild(database, childProfiles, childName);
                    $(this).closest('tr').remove();
                }); 
            });
             
        });//end of promise
    }
    
})

//function to display children in a table format
function displayChildren(childrenNames){   
    
    printEntries = "";
    childrenNames.forEach(function(childName){
        if($("#"+childName).length == 0)
        {
            printEntries += "<tr>" 
            + "<td id = '"+childName+"'>" 
            + childName + "</td>"
            + "<td><button id = 'delete-btn' type='button' class='btn btn-secondary btn-sm'"
            + "data-childName = '" + childName + "'"
            + ">Delete</button></td>"
            + "</tr>";
        }
    });
    document.getElementById('children-table').innerHTML += printEntries;   
}

//function to remove all instances of a child from DB
function removeChild(db, childProfiles, childName){
    childProfiles.forEach(function(childProfile){
        if(childProfile.profileName == childName)
        {   
            console.log("Phyllis was found...");
            //next remove device from Devices node
            if(childProfile.deviceType == "android")
                ref = db.ref("devices").child(childProfile.deviceID);
            else
                ref = db.ref("devices").child(childProfile.deviceID).child("accounts")
                .child(childProfile.accountID);
            ref.remove().then(function() {
                console.log("Device successfully removed from Devices node.")
            })
            .catch(function(error) {
                console.log("Device removal from Devices failed: " + error.message)
            });
        }
    });

}

// function to remove a specified whitelist entry
// function removeDevice(db, deviceID, userID)
// {   
//     //first remove the device from Users node
//     ref = db.ref("users").child(userID).child("devices").child(deviceID);
//     ref.remove().then(function() {
//         console.log("Device successfully removed from Users node.")
//     })
//     .catch(function(error) {
//         console.log("Device removal from Users failed: " + error.message)
//     });

//     //next remove device from Devices node
//     ref = db.ref("devices").child(deviceID);
//     ref.remove().then(function() {
//         console.log("Device successfully removed from Devices node.")
//     })
//     .catch(function(error) {
//         console.log("Device removal from Devices failed: " + error.message)
//     });
// }

