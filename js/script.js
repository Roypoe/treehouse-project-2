/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/

// Set project variables
const number = 10; // number of items per page
const page = 1; // min number of pages

const students = document.querySelectorAll(".student-item");
const studentList = [];
const pageDiv = document.querySelector(".page");

const pageLis = document.createElement("ul");
const pagDiv = document.createElement("div"); // create button div
// nameList
const names = document.querySelectorAll("h3");
// Search box
const divPageHeader = document.querySelector(".page-header");
const divSearch = document.createElement("div");
const inputSearch = document.createElement("input");
const buttonSearch = document.createElement("button");
// Missing results alert
const divAlert = document.createElement("div");
const bigList = document.querySelector(".student-list");

let pages; // number of buttons variable
let lis = ""; // merged button html
let firstButton = ""; // initial active button variable

/***
Create Helper Functions
***/

// create students list array
for (let i = 0; i < students.length; i++) {
  studentList.push(i);
}

// create array of visible elements
let visibleElements = studentList;

// Calculate StartNumber
function startNr(page, number) {
  return (page - 1) * number;
}

// Calculate EndNumber: To be defined as the smaller of students.length and ((page*number)-1)
function endNr(list, page, number) {
  return Math.min(page * number - 1, list.length - 1);
}

// Set active state button style
function activeButton(list, aElement) {
  removeStyles(list.children);
  aElement.className = "active";
}

// Set Style of last Item displayed (remove border-bottom)
function lastItemDisplayedStyle(list, start, end) {
  for (let i = start; i <= end - 1; i++) {
    students[list[i]].classList.remove("student-item-last");
  }
  students[list[end]].classList.add("student-item-last");
}

// Remove old button styles (remove active state)
function removeStyles(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].children[0].removeAttribute("class");
  }
}

// Calculate number of buttons
function buttons(list) {
  // Check for residual
  let helper = list.length - parseInt(list.length / number) * number;
  // logic for number of pages/buttons to be created
  if (helper === 0 && number !== list.length) {
    pages = list.length / number;
  } else if (helper > 0 && helper < list.length) {
    pages = parseInt(list.length / number) + 1;
  } else if (helper >= list.length) {
    pages = 0;
  }
  return pages;
}

// Add button actions
function buttonAction(buttonUl) {
  // pagination button action
  buttonUl.addEventListener("click", function(e) {
    let event = e.target;
    let eventNr = parseInt(event.textContent);
    showPage(visibleElements, eventNr, number);
    // set active state button if any button
    if (sessionStorageTest() && sessionStorage.eventNr) {
      firstButton = sessionStorage.eventNr;
    }
    if (firstButton !== null) {
      activeButton(pageLis, event);
    }
    // save last button in active state to session storage
    if (sessionStorageTest()) {
      sessionStorage.eventNr = eventNr;
    }
  });
}

// Add button ul to div
function addUl(ul) {
  ul.className = "pagination";
  ul.innerHTML = lis;
  pageDiv.appendChild(pageLis);
}

// session Storage check
function sessionStorageTest() {
  try {
    return "sessionStorage" in window && window["sessionStorage"] !== null;
  } catch (e) {}
}

// Hide all list elements
function hideListElements() {
  for (let i = 0; i < studentList.length; i++) {
    students[studentList[i]].style.display = "none";
  }
}

/***
   Create the `showPage` function to hide all of the items in the
   list except for the ten you want to show.
***/

function showPage(list, page, number) {
  // Calculate Start and End number
  let start = startNr(page, number);
  let end = endNr(list, page, number);
  // Hide all listElements
  hideListElements();
  // Show required listElements
  for (let i = start; i <= end; i++) {
    students[list[i]].style.display = "block";
  }
  // Change style of last Item displayed - remove border-bottom
  if (list.length != 0) {
    lastItemDisplayedStyle(list, start, end);
  }
}

/***
   Create the `appendPageLinks function` to generate, append, and add
   functionality to the pagination buttons.
***/

function appendPageLinks(students) {
  // remove old ul if exists
  for (let i = 0; i < pageLis.children.length; i++) {
    pageLis.removeChild(pageLis.children[i]);
  }
  // remove old buttons if necessary
  lis = "";
  // number of buttons
  pages = buttons(students);
  // create ul button html
  for (let i = 1; i <= pages; i++) {
    lis += `
          <li>
            <a href="#">${i}</a>
          </li>
        `;
  }
  // Add button Ul
  addUl(pageLis);
  // Add button actions
  buttonAction(pageLis);
}

// Add search box
function createAppendSearchBox() {
  divSearch.className = "student-search";
  inputSearch.setAttribute("placeholder", "Search for students...");
  buttonSearch.textContent = "Search";
  divSearch.appendChild(inputSearch);
  divSearch.appendChild(buttonSearch);
  divPageHeader.appendChild(divSearch);
}

// Listen for search event
divSearch.addEventListener("click", e => {
  // Input Value
  let searchTerm = inputSearch.value;
  // Only listen for button
  if (e.target.tagName === "BUTTON") {
    // Update Session Storage
    if (sessionStorageTest()) {
      if (visibleElements.length === 0 || inputSearch.value === "") {
        sessionStorage.removeItem("searchText");
        sessionStorage.removeItem("eventNr");
      } else {
        sessionStorage.searchText = searchTerm;
      }
    }
    // Update results
    resultsDisplay(searchTerm);
  }
});

// function displaying results: search, session storage
function resultsDisplay(searchTerm) {
  // empty visibleElements
  visibleElements = [];

  // add Elements that contain searchterm in name
  for (let i = 0; i < studentList.length; i++) {
    if (names[i].textContent.indexOf(searchTerm) != -1) {
      visibleElements.push(i);
    }
  }
  // Message informing no results were found if necessary
  if (visibleElements.length === 0) {
    alertMessage();
  } else if (document.querySelector(".alert")) {
    pageDiv.removeChild(document.querySelector(".alert"));
  }

  appendPageLinks(visibleElements);
  if (
    sessionStorage.eventNr &&
    document.querySelectorAll(".pagination a")[
      parseInt(sessionStorage.eventNr) - 1
    ]
  ) {
    showPage(visibleElements, parseInt(sessionStorage.eventNr), number);
  } else {
    showPage(visibleElements, 1, number);
    sessionStorage.removeItem("eventNr");
  }
  // Retrieve active page state button info form session storage
  if (
    sessionStorage.eventNr &&
    document.querySelectorAll(".pagination a")[
      parseInt(sessionStorage.eventNr) - 1
    ]
  ) {
    firstButton = document.querySelectorAll(".pagination a")[
      parseInt(sessionStorage.eventNr) - 1
    ];
  } else {
    firstButton = document.querySelector(".pagination a");
  }

  // Set active page state to button
  if (firstButton !== null) {
    activeButton(pageLis, firstButton);
  }
}

// Alert if no results were found
function alertMessage() {
  // text/class might change depending on results
  divAlert.textContent = "No results have been found!";
  divAlert.className = "alert";
  // append box
  pageDiv.insertBefore(divAlert, bigList);
  sessionStorage.removeItem("eventNr");
}

/* ------ call functions -------*/
appendPageLinks(students);

// Set initial values from sessionStorage
let pageNr = page;

if (sessionStorageTest()) {
  if (sessionStorage.eventNr) {
    firstButton = document.querySelectorAll(".pagination a")[
      parseInt(sessionStorage.eventNr) - 1
    ];
    pageNr = parseInt(sessionStorage.eventNr);
  } else {
    firstButton = document.querySelector(".pagination a");
    pageNr = page;
  }
  if (sessionStorage.searchText) {
    firstSearch = sessionStorage.searchText;
  } else {
    firstSearch = "";
  }
}

// Call initial page setup functions
if (firstSearch != "") {
  resultsDisplay(firstSearch);
  inputSearch.value = firstSearch;
} else {
  showPage(studentList, pageNr, number);
  if (students.length > number && firstButton !== null) {
    activeButton(pageLis, firstButton);
  }
}

// Call create Search box
createAppendSearchBox();
