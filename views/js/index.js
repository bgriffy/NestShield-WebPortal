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
let windowsRef = ""; 
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
        This block of code includes a nested query. First we retrieve
        the device ID, then we use that device ID inside the nested
        query. The nested query retrieves all the info relevant to a 
        childs profile (profile name, whitelist, whitelistSize). For 
        windows, it does this for every account associated with a device. 
        We then repeat this whole process for every device the user has.  
        */
        console.log("You are logged in.");
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
                            whiteList: Object.values((snapshot.child("whitelist_entries").val())),
                            deviceName: snapshot.child("child_name").val() + "-Android", 
                            androidDevice: true
                        };
                        
                        childProfiles.push(childProfile);

                        //store childs name into array
                        if(!childrenNames.includes(childProfile.profileName))
                            childrenNames.push(childProfile.profileName);
                        
                        if(lastDevice == false)
                            return; 
                        
                        displayWL(childProfiles, childrenNames, "android", hasAndroid);
                    }
                });
                

                //----windows devices----
                windowsRef = database.ref("devices/").child(currentDevice).child("accounts"); 
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
                                whiteList: Object.values((snapshot.child(currentAcct).child("whitelist_entries").val())),
                                listSize: snapshot.child(currentAcct).child("whitelist_size").val(),
                                deviceName: snapshot.child(currentAcct).child("DeviceName").val()
                            };
                            
                            childProfiles.push(childProfile);

                            //store childs name into array
                            if(!childrenNames.includes(childProfile.profileName))
                                childrenNames.push(childProfile.profileName);
                        });
                    }

                    if(lastDevice == false)
                        return; 
                    displayWL(childProfiles, childrenNames, "windows");
                });  
            });
        });
    }
})

//function to display whitelists for devices
function displayWL(childProfiles, childrenNames, deviceType)
{   
    let hasAndroid = false; 
    let tabClass = ""; 
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
                document.getElementById(childDiv).innerHTML += printHead;
            else
                document.getElementById(childDiv).innerHTML = printHead;  
    });
    
    //default device will be the first device
    tabClass = "' class='contentTab tab-pane active'>";

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
            childProfile.whiteList.forEach(function(entryName){
                
                printEntries += "<tr>" 
                + "<td>"+entryName+"</td>"
                + "<td><button type='button' class='btn btn-secondary btn-sm'>Monitor</button></td>"
                + "<td><button type='button' class='btn btn-secondary btn-sm'>Restrict</button></td>"
                + "<td><button type='button' class='btn btn-secondary btn-sm'>Delete</button></td>"
                + "</tr>";
            });

            printEntries += "</tbody>"
            +"</table>"
            +"</div>"
        }
    });

    document.getElementById('tab-content').innerHTML = printEntries;
    androidDevice = false;
}