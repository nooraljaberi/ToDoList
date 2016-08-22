// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.


var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var JobImg;
var CompletedList = [];
var PendingList = [];
(function () {
    "use strict";

 
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    $("#PendingPage").on("pagebeforeshow", LoadJobsList);
    $("#CompletedPage").on("pagebeforeshow", LoadCompletedList);
    document.querySelector("#btn_Add").addEventListener("click", AddEntry, false);
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    $("#CameraBtn").on("click", capturePhoto);

    document.querySelector("#btnEmail").addEventListener("click", doEmail, false);
   document.querySelector("#btnSortUp").addEventListener("click", sortListUp, false);
   document.querySelector("#btnSortDown").addEventListener("click", sortListDown, false);

  
      
  function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
     
       // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
       var parentElement = document.getElementById("deviceready");
        var listeningElement = parentElement.querySelector(".listening");
        var receivedElement = parentElement.querySelector(".received");
           listeningElement.setAttribute('style', 'display:none;');
           receivedElement.setAttribute('style', 'display:block;');
     
                 
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
                "Jobimage":JobImg,
                
            };


        localStorage.setItem("entry", JSON.stringify(entry));
     
        existingEntries.push(entry);
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("PendingList", JSON.stringify(existingEntries));
        }
        document.getElementById('JobTitle').value="";
        document.getElementById('Description').value = "";
        var imgElement = document.getElementById('smallImage');
        imgElement.style.display = "none";
     
    }


    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
 
  
})  ();


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
    JobImg = "data:image/jpeg;base64," + imageData;
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
               
                var link =document.createElement("li");
                link.innerHTML =
                AddDivJobTitle(i, array[i].title, array[i].date),
                AddDivJobText(i, array[i].text),
                AddImage(i, array[i].Jobimage),
                AddSaveChangesButton(i),
                AddCompleteButton(i),
                AddDeleteJobButton(i);

            };
            $(".UiPendingList").listview("refresh");
        };
    
}

    
function AddDivJobTitle(id, text,date) {
    var element = document.createElement("h4");
    var d = new Date(date);
    element.innerHTML = text + " <P> Added on:" + d.toLocaleDateString() + "</p>";
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
    DivParent.appendChild(element);
}
   
function AddDivJobText(id,text)
{
    var  element=document.createElement("div");
    element.contentEditable=true;
    element.id = "Div" + id;
    element.innerHTML = text + "<br/>";
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
     DivParent.appendChild(element);
}

function AddImage(id, imgdata) {
    if(imgdata)
   { var element = document.createElement("img");
    element.id = "img" + id;
    element.src = imgdata;
    element.width= "80";
    element.height ="80";
    element.style.display = 'block';
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
    DivParent.appendChild(element);}
}
function AddCompleteButton(id)
{
    var element = document.createElement("input");
    //Assign different attributes to the element. 
    element.type = "button";
    element.id = "Add" + id;
    var att="data-icon="+"check";
   element.attributes=att;
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

        LoadJobsList(PendingList);

        var ExsistingCompleted = JSON.parse(localStorage.getItem("CompletedList"));
         if (ExsistingCompleted == null) ExsistingCompleted = [];
        ExsistingCompleted.push(DeletedJob);
        localStorage.setItem("CompletedList", JSON.stringify(ExsistingCompleted));
     

    }, false);
    var divid = "job" + id;
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
    DivParent.appendChild(element);
 };
  
function AddSaveChangesButton(id) {
    var element = document.createElement("input");
    //Assign different attributes to the element. 
    element.type = "button";
    element.id = "Div" + id;
    element.value = "Save Edit";
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
    
    var divid = "job" + id;
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
    DivParent.appendChild(element);
};
function AddDeleteJobButton(id)
{
    var element = document.createElement("input");
    element.type = "button";
    element.id = "DeleteJob" + id;
    element.value = "Delete";
    element.class = "ui-btn ui-icon-delete";
    element.addEventListener("click", function DeleteJob() {

        var currentlist = localStorage.getItem("PendingList");
        if (currentlist) { PendingList = JSON.parse(currentlist); }
        PendingList.splice(id, 1);
        localStorage.setItem("PendingList", JSON.stringify(PendingList));
        LoadJobsList(PendingList);

    }, false);

    
    var divid = "job" + id;
    var DivParent = document.getElementById("UiPendingList");
    //Append the element in page (in span).  
    DivParent.appendChild(element);
}


function LoadCompletedList(array) {
   
    $("#CompletedJobList").html("");
   
        array= JSON.parse(localStorage.getItem("CompletedList"));
     if (array !== null) {
        for (var i = 0 ; i < array.length; i++) {
            var obj = array[i];
            for (var l in obj) {
                $("#CompletedJobList").append(
               "<div data-role=" + "collapsible" + " data-collapsed=" + "false" + ">" + "<h3>" + obj[l].title + "</h3>" +
                   "<p>" + obj[l].text + "</p> <br/>"+  "</div>");
                 
                AddDeleteCompletedJobButton(l);
            }
            
        }
        $("#ComletedJobList").collapsibleset().collapsibleset("refresh");
      
     
    }
}
function AddDeleteCompletedJobButton(id)
{ 
    var element = document.createElement("input");
    element.type = "button";
    element.id = "DeleteCompleted" + id;
    var btnid = element.id;
    element.value = "Delete Job";
    element.class = "ui-btn ui-icon-delete";
    element.addEventListener("click", function DeleteJob() {

        id = document.getElementById(btnid).value;
        var currentlist = localStorage.getItem("CompletedList");
        if (currentlist) { CompletedList = JSON.parse(currentlist); }
        CompletedList.splice(id, 1);
        localStorage.setItem("CompletedList", JSON.stringify(CompletedList));
        LoadCompletedList();

    }, false);
    var DivParent = document.getElementById("CompletedJobList");
    //Append the element in page (in span).  
    DivParent.appendChild(element);
}


    function sortListUp(array) {
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

    function capturePhoto() {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoDataSuccess, onFail,
            {
                quality: 50,
                destinationType: destinationType.DATA_URL, saveToPhotoAlbum: true
            });
        nav
    }
    function getPhoto(source) {
        // Retrieve image file location from specified source
       
        navigator.camera.getPicture(onPhotoURISuccess, onFail, {
            quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: source
        });
    }

    // Called if something bad happens.
    //
    function onFail(message) {
        alert('Failed because: ' + message);
    }
    function doEmail()
    {
        // open default built email composer accout and add the pending job list in message body 
      
      var array = [];
        array = JSON.parse(localStorage.getItem("PendingList"));
        var messagebody="Pending Job List";
        for (var i = 0 ; i < array.length; i++) {
            messagebody +="%0D%0A"+ "job:" + array[i].title +
            "%0D%0A" + "Description:" + array[i].text + "%0D%0A" ;
        }
        var Toaddress = document.getElementById("txtEmail").value;
        btnEmail.href="mailto:"+Toaddress+"?subject=Pending Job&body=";
        btnEmail.href +=messagebody;
       
    }

