"use strict";

const urlParams = new URLSearchParams(window.location.search);
const authorId = urlParams.get('authorId');

const names = document.getElementsByClassName("authorName");
for (let i = 0; i < names.length; i++) {
    console.log(names[i])
    names[i].classList.add('d-none');
    if(names[i].dataset["authorid"] == authorId){
        names[i].classList.remove('d-none');
    }
}
