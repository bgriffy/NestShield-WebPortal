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
let accounts = [];
let childrenNames = [];
let childProfiles = [];

//useful variables
let thisAccount = "";
let printHead = ""; 
let printEntries = "";
let androidDevice = false; 

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
            
            //loop through each device
            devices.forEach(function(currentDevice){
                console.log("current device from loop: " + currentDevice);
                
                let childRef = database.ref("devices/").child(currentDevice)
                childRef.once("value").then(function(snapshot){
                    if (snapshot.hasChild("type")) {
                        console.log(currentDevice + "is an android device.")
                        androidDevice = true; 
                      }
                });
                
                if(androidDevice == false)
                {
                //get a data snapshot of the accounts associated with the device 
                childRef = database.ref("devices/").child(currentDevice).child("accounts")
                childRef.once("value").then(function(snapshot){
                    
                    //get list of the accounts
                    accounts = Object.keys(snapshot.val());
                    
                    //loop through each account   
                    accounts.forEach(function(currentAcct){
                        
                        //store child profile info into JS object, insert into profile array
                        let childProfile = {
                            profileName: snapshot.child(currentAcct).child("ProfileName").val(),
                            whiteList: Object.values((snapshot.child(currentAcct).child("whitelist_entries").val())),
                            listSize: snapshot.child(currentAcct).child("whitelist_size").val(),
                        };
                        
                        childProfiles.push(childProfile);

                        //store childs name into array
                        if(!childrenNames.includes(childProfile.profileName))
                            childrenNames.push(childProfile.profileName);
                    })

                    //send tab headers (child names) to HTML
                    childrenNames.forEach(function(childName){
                        printHead += "<li><a class = 'tab-btn' data-toggle='tab' href='#" + childName + "'>" + childName + "</a></li>";
                    });
                    $(document).find('#childTabs').html(printHead);

                    
                    let tabClass = "' class='contentTab tab-pane fade show active'>";

                    //send child profiles to HTML
                    childProfiles.forEach(function(childProfile){
                        printEntries += "<div id='" + childProfile.profileName + tabClass
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
                        
                        tabClass = "' class='contentTab tab-pane fade'>";
                        childProfile.whiteList.forEach(function(entryName){
                            printEntries += "<tr>" 
                            + "<th scope='row'>"+entryName+"</th>"
                            + "<td><button type='button' class='btn btn-secondary btn-sm'>Monitor</button></td>"
                            + "<td><button type='button' class='btn btn-secondary btn-sm'>Restrict</button></td>"
                            + "<td><button type='button' class='btn btn-secondary btn-sm'>Delete</button></td>"
                            + "</tr>";
                        });
    
                        printEntries += "</tbody>"
                        +"</table>"
                        +"</div>"
                });
                $(document).find('#tab-content').html(printEntries);

                });}  
            });
        });
    }
})