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
                            document.getElementById(childDiv).innerHTML = printHead;
                    });

                    let tabClass = "' class='contentTab tab-pane fade'>";

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
                            
                            tabClass = "' class='contentTab tab-pane fade'>";
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