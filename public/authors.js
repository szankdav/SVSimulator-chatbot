"use strict";

const pageURL = "http://localhost:3000/authors";
let pageNumber = parseInt(window.location.href.split("/").slice(-1));
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const firstPageNumberButton = document.getElementById("firstPageNumberButton");
const secondPageNumberButton = document.getElementById(
  "secondPageNumberButton"
);
const thirdPageNumberButton = document.getElementById("thirdPageNumberButton");

const maxPageNumber = nextButton.dataset.maxpages;

const changePageNumbers = () => {
  if (pageNumber === 1) {
    firstPageNumberButton.innerText = pageNumber;
    firstPageNumberButton.href = `${pageURL}/${pageNumber}`;
    secondPageNumberButton.innerText = pageNumber + 1;
    secondPageNumberButton.href = `${pageURL}/${secondPageNumberButton.innerText}`;
    thirdPageNumberButton.innerText = pageNumber + 2;
    thirdPageNumberButton.href = `${pageURL}/${thirdPageNumberButton.innerText}`;
    nextButton.href = `${pageURL}/${pageNumber + 1}`;
  } else if(pageNumber < maxPageNumber) {
    firstPageNumberButton.innerText = pageNumber - 1;
    firstPageNumberButton.href = `${pageURL}/${pageNumber - 1}`;
    previousButton.href = `${pageURL}/${firstPageNumberButton.innerText}`;
    secondPageNumberButton.innerText = pageNumber;
    secondPageNumberButton.href = `${pageURL}/${secondPageNumberButton.innerText}`;
    thirdPageNumberButton.innerText = pageNumber + 1;
    thirdPageNumberButton.href = `${pageURL}/${thirdPageNumberButton.innerText}`;
    nextButton.href = `${pageURL}/${thirdPageNumberButton.innerText}`;
  } else {
    firstPageNumberButton.innerText = pageNumber - 1;
    firstPageNumberButton.href = `${pageURL}/${pageNumber - 1}`;
    previousButton.href = `${pageURL}/${firstPageNumberButton.innerText}`;
    secondPageNumberButton.innerText = pageNumber;
    secondPageNumberButton.href = `${pageURL}/${secondPageNumberButton.innerText}`;
    thirdPageNumberButton.classList.add("d-none");
  }
};

const authorRows = document.getElementsByClassName("authorRow");
for (let i = 0; i < authorRows.length; i++) {
  authorRows[i].addEventListener("click", () => {
    window.location = `http://localhost:3000/messages/author/${authorRows[i].dataset.id}`;
  });
}

previousButton.addEventListener("click", () => {
  changePageNumbers();
});

nextButton.addEventListener("click", () => {
  changePageNumbers();
});

changePageNumbers();
