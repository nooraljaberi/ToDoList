// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.


(function () {
    "use strict";

 
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    $("#PendingPage").on("pagebeforeshow", LoadJobsList);
   $("#CompletedPage").on("pagebeforeshow", LoadCompletedList);
    document.querySelector("#btn_Add").addEventListener("click", AddEntry, false);
   document.querySelector("#btnEmail").addEventListener("click", doEmail, false);
   document.querySelector("#btnSortUp").addEventListener("click", sortListUp, false);
   document.querySelector("#btnSortDown").addEventListener("click",sortListDown, false);
  function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
        
     
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
           listeningElement.setAttribute('style', 'display:none;');
           receivedElement.setAttribute('style', 'display:block;');
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
      // check email plugin
        var isAvailable = false;
        if (window.plugin) {
            window.plugin.email.isServiceAvailable(
                function (emailInstalled) {
                    isAvailable = emailInstalled;
                }
            );
        }


    };
    
    function AddEntry(e) {

         var existingEntries = JSON.parse(localStorage.getItem("PendingList"));
        if (existingEntries == null) existingEntries = [];
        var entryTitle = document.getElementById('JobTitle').value;
        var entryText = document.getElementById('Description').value;
        var entry =
            {
                "title": entryTitle,
                "text": entryText,
                "date": Date.now(),
                //"jobimage":
            };


        localStorage.setItem("entry", JSON.stringify(entry));
     
        existingEntries.push(entry);
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("PendingList", JSON.stringify(existingEntries));
        }
    
    }


    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
 
  
})  ();
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var CompletedList = [];
var PendingList = [];

function onPhotoDataSuccess(imageData) {

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
}
function onPhotoURISuccess(imageURI) {
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
}
function onFail(message) {
    alert('Failed because: ' + message);
}

function LoadJobsList(array)
{ 
    $("#UiPendingList").html("");
    if (!array.length)
    {
        array = JSON.parse(localStorage.getItem("PendingList"));
    }
   
        if (array !== null) {
            for (var i = 0 ; i < array.length; i++) {
                $("#UiPendingList").append("<li><div data-role=" + "collapsible" + ">" + "<h2>" + array[i].title + "</h2> <br/>" +
                 AddDivJobText(i, array[i].text) +
                "<br/>" +

                AddCompleteButton(i) +
                AddSaveChangesButton(i) +
                AddDeleteJobButton(i) + "</div> </li>");

            };

        };
    
    $("#PendingJobList").collapsibleset().collapsibleset("refresh");
    // 
}

  //      " <button id="+"btnDone"+"'"+i+"'"+ " value=" + i + " data-icon=" + "check" + "> </button>" +
                           //     " <button id="+"btnDelete"+i + " value=" + i + " data-icon=" + "delete"  + "> </button>" +
   

   
function AddDivJobText(id,text)
{
    var  element=document.createElement("div");
    element.contentEditable=true;
    element.id = "Div" + id;
    element.innerHTML = text;
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
     DivParent.appendChild(element);
}

function sortListUp(array)
{
    var array = JSON.parse(localStorage.getItem("PendingList"));
    array.sort(date_sort_asc);
    LoadJobsList(array);
}
function sortListDown(array) {
    var array = JSON.parse(localStorage.getItem("PendingList"));
    array.sort(date_sort_desc);
    LoadJobsList(array);
}
var date_sort_asc = function (date1, date2) { 
       // This is a comparison function that will result in dates being sorted in 
       // ASCENDING order. As you can see, JavaScript's native comparison operators 
       // can be used to compare dates. This was news to me. 
       if (date1.date > date2.date) return 1; 
       if (date1.date < date2.date) return -1; 
       return 0; 
     }; 
 
 var date_sort_desc = function (date1, date2) { 
       // This is a comparison function that will result in dates being sorted in 
       // DESCENDING order. 
       if (date1.date > date2.date) return -1; 
       if (date1.date < date2.date) return 1; 
       return 0; 
     }; 


function AddCompleteButton(id)
{
    var element = document.createElement("input");
    //Assign different attributes to the element. 
    element.type = "button";
    element.value = "Done";
    element.class = "ui-btn ui-icon-check";
    element.addEventListener("click",function AddComplete() {
       
        var currentlist = localStorage.getItem("PendingList");
        if (currentlist)
        {
            JobList = JSON.parse(currentlist);
        }
        //  var CompletedJob = [];
        var DeletedJob = JobList.splice(id, 1);
   
        localStorage.setItem("PendingList", JSON.stringify(JobList));

        var ExsistingCompleted = JSON.parse(localStorage.getItem("CompletedList"));

        if (ExsistingCompleted == null) ExsistingCompleted = [];
        ExsistingCompleted.push(DeletedJob);
        localStorage.setItem("CompletedList", JSON.stringify(ExsistingCompleted));
       LoadJobsList(PendingList);

    }, false);
   
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
    DivParent.appendChild(element);
 };

    
function AddSaveChangesButton(id) {
    var element = document.createElement("input");
    //Assign different attributes to the element. 
    element.type = "button";
    element.id = "Div" + id;
    element.value = "Save Changes";
    element.class = "ui-btn ui-icon-refresh";
    element.addEventListener("click", function SaveChanges() {
        var currentlist = []; currentlist= JSON.parse(localStorage.getItem("PendingList"));
        var val="Div"+id;
        editElement=document.getElementById(val);
        userinput= editElement.innerHTML;
       
        currentlist[id].text = userinput;
        localStorage.setItem("PendingList", JSON.stringify(currentlist));
        LoadJobsList(PendingList);

    }, false);

    //   document.querySelector(element.value).addEventListener("click", AddComplete, false);
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
    DivParent.appendChild(element);
};
function AddDeleteJobButton(id)
{
    var element = document.createElement("input");
    element.type = "button";
    element.id = "DeleteJob" + id;
    element.value = "Delete Job";
    element.class = "ui-btn ui-icon-delete";
    element.addEventListener("click", function DeleteJob() {

        var currentlist = localStorage.getItem("PendingList");
        if (currentlist) { PendingList = JSON.parse(currentlist); }
        PendingList.splice(id, 1);
        localStorage.setItem("PendingList", JSON.stringify(PendingList));
        LoadJobsList(PendingList);

    }, false);

    //   document.querySelector(element.value).addEventListener("click", AddComplete, false);
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
    DivParent.appendChild(element);
}


function LoadCompletedList(array) {
   // localStorage.clear();
    $("#CompletedJobList").html("");
   
        array= JSON.parse(localStorage.getItem("CompletedList"));
     if (array !== null) {
        for (var i = 0 ; i < array.length; i++) {
            var obj = array[i];
            for (var l in obj) {
                $("#CompletedJobList").append(
               "<div data-role=" + "collapsible" + " data-collapsed=" + "false" + ">" + "<h2>" + obj[l].title + "</h2>" +
                   "<p>" + obj[l].text + "</p>"+
                              " <a data-role="+"button"+"  id=" + "btnDel" + " value=" + i + " data-icon=" + "delete"  + "> Delete </a> " +
                  "</div>");
          
            }
        }
        $("#ComletedJobList").collapsibleset().collapsibleset("refresh");
      
     
    }
}
    function DeleteCompleted() {
        id = document.getElementById("btnDelete").value;
        var currentlist = localStorage.getItem("CompletedList");
        if (currentlist) { CompletedList = JSON.parse(currentlist); }
        CompletedList.splice(id, 1);
        localStorage.setItem("CompletedList", JSON.stringify(CompletedList));
        LoadCompletedList();
    }



    function doEmail() {

      var subject = "Pending Jobs";

        var array = [];
        array = JSON.parse(localStorage.getItem("PendingList"));
        var messagebody;
        for (var i = 0 ; i < array.length; i++) {
            messagebody.append(
            " <div>" +
            "<h2>" + array[i].title + "</h2>" +
                "<p> " + array[i].text + "</br>" +
                            "</div> <br/>");
        }

        if (!window.plugin) {
            //non-mobile - plugins are not present.
            alert("Email plugin is not available");
            
            return;
        }
        if (!isAvailable) {
            //mobile, but no email installed
            alert("Email is not available")
            return;
        }
        window.plugin.email.open({
            to: [], cc: [], bcc: [], attachments: [],
            subject: subject,
            body: message,
            isHtml: true
        });
      
    }

