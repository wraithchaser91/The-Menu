let saveButton = document.getElementById("saveLayoutButton");
let isSaveShown;
if(saveButton && typeof saveButton != "undefined"){
    saveButton.addEventListener("click", ()=>saveConfig());
    isSaveShown = false;
}

const draggables = [...document.getElementsByClassName("draggableItem")];
const containers = document.getElementsByClassName("draggableContainer");

for(let item of draggables){
    item.addEventListener("dragstart", ()=>{
        item.classList.add("dragging");
    })
    item.addEventListener("dragend", ()=>{
        item.classList.remove("dragging");
        showButton();
    })
}

for(let item of containers){
    item.addEventListener("dragover", (e)=>{
        const draggable = document.getElementsByClassName("dragging")[0];
        if(!draggable)return;
        e.preventDefault();
        const afterElement = getDragAfterElement(item, e.clientY);
        if(afterElement == null){
            item.appendChild(draggable);
        }else{
            item.insertBefore(draggable, afterElement);
        }
    });
}

getDragAfterElement = (container, y) =>{
    const draggableElements = [...container.querySelectorAll(".draggableItem:not(.dragging)")];
    return draggableElements.reduce((closest,child)=>{
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height/2;
        if(offset < 0 && offset > closest.offset){
            return {offset: offset, element:child};
        }else{
            return closest;
        }
    }, {offset:Number.NEGATIVE_INFINITY}).element;
}

showButton = () =>{
    if(typeof saveButton == "undefined")return;
    if(isSaveShown)return;
    saveButton.style.display = "block";
    setTimeout(()=>{
        saveButton.style.transform = "scale(1)";
    },100);
    isSaveShown = true;
}