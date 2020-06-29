let overlay = document.getElementById("overlay");
overlay.addEventListener("click", (e)=>{
    e.stopPropagation();
    if(isPopupOpen)closePopup();
});

let deleteButtons = document.getElementsByClassName("deleteButton");
for(let button of deleteButtons){
    button.addEventListener("click", ()=>openPopup(button.getAttribute("data")));
}

let popup = document.getElementById("popup");
let popupCancelButton = document.getElementById("cancelPopup");
popupCancelButton.addEventListener("click", ()=>closePopup());
let isPopupOpen = false;
closePopup = () =>{
    overlay.style.display = "none";
    popup.style.transform = "scale(0) translateY(-100px)";
    isPopupOpen = false;
}

let deleteForm = document.getElementById("deleteForm");
openPopup = id =>{
    deleteForm.action = `/delete/${id}?_method=DELETE`;
    overlay.style.display = "block";
    popup.style.transform = "scale(1) translateY(0)";
    isPopupOpen = true;
}