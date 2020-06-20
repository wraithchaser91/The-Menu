toClipboard = text =>{
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

let copyButtons = document.getElementsByClassName("copyButton");
for(let button of copyButtons){
    button.addEventListener("click", ()=>toClipboard(button.getAttribute("data")));
}