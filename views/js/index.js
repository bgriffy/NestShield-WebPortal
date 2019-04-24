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
        /* 
        This block of code includes two nested queries. First we retrieve
        the device ID, then we use that device ID inside each of the nested
        queries. The nested queries retrieve all the info relevant to a 
        childs profile (profile name, whitelist, whitelistSize). One query
        is for android devices and the other is for windows devices. 
        */
       
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
                            whiteList: Object.entries((snapshot.child("whitelist_entries").val())),
                            deviceName: snapshot.child("child_name").val() + "-Android",
                            deviceID: currentDevice, 
                            androidDevice: true
                        };
                        
                        childProfiles.push(childProfile);

                        //store childs name into array
                        if(!childrenNames.includes(childProfile.profileName))
                            childrenNames.push(childProfile.profileName);
                        
                        if(lastDevice == false)
                            return; 
                        console.log("currentDevice in Android: " + currentDevice);
                        console.log("deviceID in Android: " + childProfile.deviceID);
                        displayWL(childProfiles, childrenNames, "android", hasAndroid, childProfile.deviceID);
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
                                whiteList: Object.entries((snapshot.child(currentAcct).child("whitelist_entries").val())),
                                listSize: snapshot.child(currentAcct).child("whitelist_size").val(),
                                deviceName: snapshot.child(currentAcct).child("DeviceName").val(),
                                deviceID: currentDevice, 
                                accountID: currentAcct
                            };
                            
                            childProfiles.push(childProfile);

                            //store childs name into array
                            if(!childrenNames.includes(childProfile.profileName))
                                childrenNames.push(childProfile.profileName);
                        });
                    }

                    if(lastDevice == false)
                        return; 
                    displayWL(childProfiles, childrenNames, "windows", currentDevice);
                    snapshot.child("child_name").val();
                }); 
            });

        });
        
        //reset everything
        devices = [];
        deviceNames = [];
        accounts = [];
        childrenNames = [];
        childProfiles = []; 
        thisAccount = "";
        printHead = ""; 
        printEntries = "";
        index = 0;
        lastDevice = false; 
        androidDevice = false;
        hasAndroid = false;

        //event listener for windows delete buttons 
        $(document).on('click','#windows-delete-btn',function(){
            console.log("delete button clicked...");
            let deviceID = $(this).attr('data-deviceID');
            let entryID = $(this).attr('data-entryID');
            let accountID = $(this).attr('data-accountID');
            console.log("deviceID: " + deviceID);
            console.log("entryID: " + entryID);
            console.log("accountID: " + accountID);
            removeFromWL(database, deviceID, entryID, accountID); 
            $(this).closest('tr').remove();
          });
    }
})

//function to display whitelist for each device
function displayWL(childProfiles, childrenNames, deviceType, currentDevice)
{   
    let hasAndroid = false; 
    let tabClass = ""; 
    deleteData =  "id='android-delete-btn'"
    //send child-name tab headers to HTML
    childrenNames.forEach(function(childName){
        
        let childDiv = childName + "Div";
        let childElem = document.getElementById(childDiv);
        //check to make sure childs name not listed already
        if(childElem == null)
        {
            printHead = "<div class ='childHeader' id = '" + childDiv + "'</div>";
            document.getElementById('childTabs').innerHTML += printHead;
        }
        printHead = "<ul class='nav nav-tabs'>"
            + "<li class = 'dropdown'>"
            + "<a data-toggle='dropdown' class='dropdown-toggle' href='#'>"
            + childName + "</a>"
            + "<ul class='dropdown-menu'>"
            childProfiles.forEach(function(childProfile){

                //construct link for child in dropdown menu
                if(childProfile.profileName == childName)
                {
                    printHead += "<li><a class = 'dropLink' data-toggle='tab' href='#" 
                    + childProfile.deviceName + "-"
                    + childProfile.profileName + "'>"
                    + childProfile.deviceName
                    + "</a></li>";
                }
            });
            printHead += "</ul></li></ul>";
            if(deviceType == "windows")
                document.getElementById(childDiv).innerHTML = printHead;
            else
                document.getElementById(childDiv).innerHTML = printHead;  
    });
    
    //default device will be the first device
    if(deviceType == "android")
        tabClass = "' class='contentTab tab-pane active'>";
    else
        tabClass = "' class='contentTab tab-pane'>";

    //send child profiles to HTML
    childProfiles.forEach(function(childProfile){
        let whiteListDiv = childProfile.deviceName + "-" + childProfile.profileName;
        let whiteListElem = document.getElementById(whiteListDiv);
        if(whiteListElem == null)
        {
            printEntries += "<div id='" + whiteListDiv + tabClass
            + "<table class='table table-striped'>"
            + "<thead class='thead'>"
            + "<tr>"
            + "<th scope='col'>Process</th>"
            + "<th scope='col'></th>"
            + "<th scope='col'>Options</th>"
            + "<th scope='col'></th>"
            + "</tr>"
            + "</thead>"
            + "<tbody>";
            
            tabClass = "' class='contentTab tab-pane'>";

            childProfile.whiteList.forEach(function(entry){

                //only assign button data to windows devices
                //used for delete button event listener
                if(deviceType == "windows")
                {   
                    deleteData = "id='windows-delete-btn'"
                    + "data-accountID = '" + childProfile.accountID + "'"
                    + "data-deviceID = '" + childProfile.deviceID + "'"
                    + "data-entryID = '" + entry[0] + "'";
                }

                printEntries += "<tr>" 
                + "<td>"+entry[1]+"</td>"
                + "<td><button type='button' class='btn btn-secondary btn-sm'>Monitor</button></td>"
                + "<td><button type='button' class='btn btn-secondary btn-sm'>Restrict</button></td>"
                //begin delete button
                + "<td><button type='button' class='btn btn-secondary btn-sm'"
                + deleteData
                + ">Delete</button></td>"
                //end delete button
                + "</tr>";
            });

            printEntries += "</tbody>"
            +"</table>"
            +"</div>"
        }
        printHead = "";
    });

    document.getElementById('tab-content').innerHTML = printEntries;
    androidDevice = false;
}

//function to remove a specified whitelist entry
function removeFromWL(db, deviceID, entryID, userName)
{
    ref = db.ref("devices").child(deviceID).child("accounts").child(userName)
    .child("whitelist_entries").child(entryID);
    
    ref.remove().then(function() {
        console.log("WhiteList entry removal successful.")
    })
    .catch(function(error) {
        console.log("WhiteList entry removal failed: " + error.message)
    });
}