"use strict";

const pageURL = "http://localhost:3000/authors";

const urlParams = new URLSearchParams(window.location.search);
let authorId = parseInt(urlParams.get("authorId"));
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const firstPageNumberButton = document.getElementById("firstPageNumberButton");
const secondPageNumberButton = document.getElementById(
  "secondPageNumberButton"
);
const thirdPageNumberButton = document.getElementById("thirdPageNumberButton");

const changePageNumbers = () => {
  if (authorId === 1) {
    firstPageNumberButton.innerText = authorId;
    firstPageNumberButton.href = `${pageURL}?authorId=${firstPageNumberButton.innerText}`;
    secondPageNumberButton.innerText = authorId + 1;
    secondPageNumberButton.href = `${pageURL}?authorId=${secondPageNumberButton.innerText}`;
    thirdPageNumberButton.innerText = authorId + 2;
    thirdPageNumberButton.href = `${pageURL}?authorId=${thirdPageNumberButton.innerText}`;
    nextButton.href = `${pageURL}?authorId=${thirdPageNumberButton.innerText}`;
  } else {
    firstPageNumberButton.innerText = authorId - 1;
    firstPageNumberButton.href = `${pageURL}?authorId=${firstPageNumberButton.innerText}`;
    previousButton.href = `${pageURL}?authorId=${firstPageNumberButton.innerText}`;
    secondPageNumberButton.innerText = authorId;
    secondPageNumberButton.href = `${pageURL}?authorId=${secondPageNumberButton.innerText}`;
    thirdPageNumberButton.innerText = authorId + 1;
    thirdPageNumberButton.href = `${pageURL}?authorId=${thirdPageNumberButton.innerText}`;
    nextButton.href = `${pageURL}?authorId=${thirdPageNumberButton.innerText}`;
  }
};

previousButton.addEventListener("click", () => {
  changePageNumbers();
});

nextButton.addEventListener("click", () => {
  changePageNumbers();
});

firstPageNumberButton.addEventListener("click", () => {
    
})

const names = document.getElementsByClassName("authorName");
for (let i = 0; i < names.length; i++) {
  names[i].classList.add("d-none");
  if (names[i].dataset["authorid"] == authorId) {
    names[i].classList.remove("d-none");
  }
}

changePageNumbers();
