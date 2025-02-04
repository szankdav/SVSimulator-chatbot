"use strict";

const pageURL = "http://localhost:3000/authors";

let authorId = parseInt(window.location.href.split("/").slice(-1));
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
    firstPageNumberButton.href = `${pageURL}/${authorId}`;
    secondPageNumberButton.innerText = authorId + 1;
    secondPageNumberButton.href = `${pageURL}/${secondPageNumberButton.innerText}`;
    thirdPageNumberButton.innerText = authorId + 2;
    thirdPageNumberButton.href = `${pageURL}/${thirdPageNumberButton.innerText}`;
    nextButton.href = `${pageURL}/${authorId + 1}`;
  } else {
    firstPageNumberButton.innerText = authorId - 1;
    firstPageNumberButton.href = `${pageURL}/${authorId - 1}`;
    previousButton.href = `${pageURL}/${firstPageNumberButton.innerText}`;
    secondPageNumberButton.innerText = authorId;
    secondPageNumberButton.href = `${pageURL}/${secondPageNumberButton.innerText}`;
    thirdPageNumberButton.innerText = authorId + 1;
    thirdPageNumberButton.href = `${pageURL}/${thirdPageNumberButton.innerText}`;
    nextButton.href = `${pageURL}/${thirdPageNumberButton.innerText}`;
  }
};

previousButton.addEventListener("click", () => {
  changePageNumbers();
});

nextButton.addEventListener("click", () => {
  changePageNumbers();
});

changePageNumbers();
