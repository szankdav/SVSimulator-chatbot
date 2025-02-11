"use strict";

const pageURL = "http://localhost:3000/messages";
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const firstPageNumberButton = document.getElementById("firstPageNumberButton");
const secondPageNumberButton = document.getElementById(
  "secondPageNumberButton"
);
const thirdPageNumberButton = document.getElementById("thirdPageNumberButton");

const maxPageNumber = parseInt(nextButton?.dataset.maxpages, 10) || 1;

const getCurrentPage = () => {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const lastSegment = parseInt(segments[segments.length - 1], 10);
  return isNaN(lastSegment) ? 1 : lastSegment;
};

const updatePagination = (pageNumber) => {
  if (maxPageNumber <= 1) {
    hidePagination();
    return;
  }

  pageNumber = Math.max(1, Math.min(pageNumber, maxPageNumber));

  firstPageNumberButton.innerText = pageNumber > 1 ? pageNumber - 1 : "";
  if(pageNumber === 1){firstPageNumberButton?.classList.add("d-none")};
  secondPageNumberButton.innerText = pageNumber;
  thirdPageNumberButton.innerText =
    pageNumber < maxPageNumber ? pageNumber + 1 : "";
  if(pageNumber === maxPageNumber){thirdPageNumberButton?.classList.add("d-none")};
  firstPageNumberButton.href = `${pageURL}/${firstPageNumberButton?.innerText}`;
  secondPageNumberButton.href = `${pageURL}/${secondPageNumberButton?.innerText}`;
  thirdPageNumberButton.href = `${pageURL}/${thirdPageNumberButton?.innerText}`;

  previousButton.href = pageNumber > 1 ? `${pageURL}/${pageNumber - 1}` : "#";
  nextButton.href =
    pageNumber < maxPageNumber ? `${pageURL}/${pageNumber + 1}` : "#";

  previousButton?.classList.toggle("disabled", pageNumber === 1);
  nextButton?.classList.toggle("disabled", pageNumber === maxPageNumber);
};

const hidePagination = () => {
  previousButton?.classList.add("d-none");
  firstPageNumberButton?.classList.add("d-none");
  secondPageNumberButton?.classList.add("d-none");
  thirdPageNumberButton?.classList.add("d-none");
  nextButton?.classList.add("d-none");
};

document.addEventListener("DOMContentLoaded", () => {
  let pageNumber = getCurrentPage();
  updatePagination(pageNumber);

  previousButton?.addEventListener("click", (event) => {
    event.preventDefault();
    if (pageNumber > 1) {
      window.location.href = `${pageURL}/${pageNumber - 1}`;
    }
  });

  nextButton?.addEventListener("click", (event) => {
    event.preventDefault();
    if (pageNumber < maxPageNumber) {
      window.location.href = `${pageURL}/${pageNumber + 1}`;
    }
  });
});

const authorNameTds = document.getElementsByClassName("authorName");
for (let i = 0; i < authorNameTds.length; i++) {
    authorNameTds[i].addEventListener("click", () => {
        window.location = `http://localhost:3000/messages/author/${authorNameTds[i].dataset.authorid}`;
    })    
}