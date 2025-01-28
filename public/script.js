let selectedLetter =
  document.getElementById("letterSelect").childNodes[1].value;
let selectedAuthors = [];
console.log(selectedAuthors);
function toggleDiv(tableId) {
  document.getElementById("messagesTable").classList.add("d-none");
  document.getElementById("lettersDiv").classList.add("d-none");
  document.getElementById("statisticDiv").classList.add("d-none");
  document.getElementById(tableId).classList.remove("d-none");
}

function showStatistic(select) {
  const selectedLetter = select.value;
  document.getElementById(
    "statistic"
  ).textContent = `A választott betű: ${selectedLetter}`;
}

function hideRowsByName(select) {
  if (select.checked && !selectedAuthors.includes(select.value)) {
    selectedAuthors.push(select.value);
  } else if (!select.checked && selectedAuthors.includes(select.value)) {
    selectedAuthors.splice(selectedAuthors.indexOf(select.value), 1);
  }
  const table = document.getElementById("lettersTable");
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].classList.add("d-none");
    if (
      selectedAuthors.includes(table.rows[i].cells[1].innerText.trim()) &&
      table.rows[i].cells[2].innerText.trim() === selectedLetter
    ) {
      table.rows[i].classList.remove("d-none");
    }
  }
}

function hideRowsByLetter(select) {
  selectedLetter = select.value;
  const table = document.getElementById("lettersTable");
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].classList.add("d-none");
    if (selectedAuthors.length == 0) {
      if (table.rows[i].cells[2].innerText.trim() === select.value) {
        table.rows[i].classList.remove("d-none");
      } else if (
        selectedAuthors.includes(table.rows[i].cells[1].innerText.trim()) &&
        table.rows[i].cells[2].innerText.trim() === select.value
      ) {
        table.rows[i].cells[2].innerText.trim() === select.value;
      }
    }
  }
}

function reset(tableId, checkBoxClass, selectId) {
  const table = document.getElementById(tableId);
  const checkBoxes = document.getElementsByClassName(checkBoxClass);
  const select = document.getElementById(selectId);
  select.value = select[0].value;
  for (const checkBox of checkBoxes) {
    checkBox.checked = false;
  }
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].classList.remove("d-none");
  }
}
