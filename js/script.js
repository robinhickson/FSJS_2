/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/
/*jshint esversion: 8*/
// GLOBAL VARIABLES //
// ---------------------


/* Declare the variable number of list-items (student details from array) visible on one page*/
/** @type {*} */
let itemsPerPage = 9;

//Set default starting page and default array
let targetPage = 1;
let list = data;

/* Get HTML elements */
const studentsDataEntryHTML = document.querySelector('.student-list');
const linkEntryHTML = document.querySelector('.link-list');
const headerHTML = document.querySelector("header");
const matchingNumber = document.createElement("p");


// FUNCTION
// showStudentsPage(list, page)//**
//  * *
//  * @param {arr of obj} list
//  * @param {n} page
//  */
function showStudentsPage(list, page) {
   // Get first and last index of data items on each page
   let startIndex = (page * itemsPerPage) - itemsPerPage;
   let endIndex = page * itemsPerPage;

   //reset data entry field
   studentsDataEntryHTML.innerHTML = "";

   //Paint each student's details from array(list)
   list.forEach(student => {
      if (list.indexOf(student) >= startIndex && list.indexOf(student) < endIndex) {
         let studentHTML =
            `<li class="student-item cf">
         <div class="student-details">
            <img class="avatar" src=${student.picture.large} alt="Profile Picture">
            <h3>${student.name.first + " " + student.name.last}</h3>
            <span class="email">${student.email}</span>
         </div>
         <div class="joined-details">
            <span class="date">Joined ${student.registered.date}</span>
         </div>
      </li>`;
         studentsDataEntryHTML.insertAdjacentHTML('beforeend', studentHTML);
      }

   });
}


/*
FUNCTION
addPagination(list)
**
* @param {arr of obj} list
This function will create and insert/append the elements needed for the pagination buttons
*/
function addPagination(list) {

   // Get the (rounded up) number of required pagination buttons
   let numPageButtons = Math.ceil(list.length / itemsPerPage);

   //reset data entry field
   linkEntryHTML.innerHTML = "";

   //Paint the required pagination buttons, with incrementing number reference
   for (let i = 1; i <= numPageButtons; i++) {
      let linkEntry = `<li><button type="button" class="page-button">${i}</button></li>`;
      linkEntryHTML.insertAdjacentHTML('beforeend', linkEntry);
   }
   //Get the button element in first pagination item and set class active
   if (linkEntryHTML.firstChild) {
      let child = linkEntryHTML.firstChild.firstChild;
      child.classList.add("active");
   }
   //Call function to display student object entries
   showStudentsPage(list, 1);

}


/*
FUNCTIONS for search
**
*/
//Create search input elements in DOM

let searchBoxHTML = `<label for="search" class="student-search">
<input id="search" placeholder="Search by name...">
<button type="button" id="search-icon"><img src="img/icn-search.svg" alt="Search icon"></button>
<div class="items-number">
<select id="selection">
<option value="3">3</option>
<option value="9" selected>9</option>
<option value="18">18</option>
</select>
</div>
</label>`;

//add search elements to header area
headerHTML.innerHTML += searchBoxHTML;

/*
FUNCTION
searchKeywords(value)
//get the value of search input on keyup event, and create comparative array to display results
**
*
 * @param {string} value
 */
function searchKeywords(value) {
   //reset matching numbers array
   const displayMatches = [];
   // iterate through student names to check for user input text match//
   //If there's a match, display the number of matches, and those matches//

   if (value != '') {
      data.forEach((match, index) => {
         let firstName = match.name.first.toLowerCase();
         let lastName = match.name.last.toLowerCase();
         let combinedNameSpace = firstName+" "+lastName;
         let combinedNameNoSpace = firstName+lastName;
         if (firstName.includes(value) || lastName.includes(value) || combinedNameSpace.includes(value) || combinedNameNoSpace.includes(value)){
            displayMatches.push(data[index]);
         }
         list = displayMatches;
         //create results text
         if (displayMatches.length === 0) {
            matchingNumber.textContent = `${displayMatches.length} Matches. Try a new search.`;
         } else if (displayMatches.length >= 1)
            matchingNumber.textContent = `Student Matches: ${displayMatches.length}`;
         matchingNumber.setAttribute("class", "numberMatching");
         matchingNumber.style.display = "block";
      });
   } else {
      matchingNumber.textContent = '';
      matchingNumber.style.display = "none";
      displayMatches.length = 0;
      list = data;
   }
   //call new page display and add search results text
   addPagination(list, 1);
   inputSearch.before(matchingNumber);
}

//LISTENERS

//manage option selection for items per page
const selectedOption = document.getElementById("selection");
selectedOption.addEventListener('change', () => {
   itemsPerPage = parseInt(selectedOption.value, 10);
   addPagination(list);
});


//Listen for pagination button clicks and reset all button classes, then set target button class to active. 
// Finally call showStudentsPage to paint target page (clicked)
linkEntryHTML.addEventListener('click', e => {
   
   if (e.target.classList.contains("page-button")) {
      const linkCollection = linkEntryHTML.children;
      for (let j = 0; j < linkCollection.length; j++) {
         linkCollection[j].firstChild.classList.remove("active");
      }
      e.target.classList.add("active");
      targetPage = parseInt(e.target.textContent, 10);
      showStudentsPage(list, targetPage);
   }  
});

// Add keyup listener to searchbox and call searchKeywords function
const inputSearch = document.getElementById('search');
inputSearch.addEventListener('keyup', () => {
   let searchValue = inputSearch.value.toLowerCase();
   searchKeywords(searchValue);
});

//Listen for search button clicks and call search function (backup for live search function)
const searchIcon = document.getElementById('search-icon');
searchIcon.addEventListener('click', () => {
   let searchValue = inputSearch.value.toLowerCase();
   searchKeywords(searchValue);
});

// Call addPagination function to display initial page content using data array from data.js
addPagination(data);