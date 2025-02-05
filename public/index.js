"use strict";

let activePage = window.location.href.split("/");
activePage = activePage.filter((x) => x != "");

const navLinks = document.getElementsByClassName("nav-link");

for (const navLink of navLinks) {
  if (activePage.includes(navLink.textContent.toLowerCase())) {
    navLink.classList.add("active");
  } else {
    navLink.classList.remove("active");
  }
}
