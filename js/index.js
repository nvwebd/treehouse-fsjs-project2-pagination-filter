'use strict';

/**
 * [extractChildren extracting child elements from a parent element]
 * @param  {[Element]} extractFrom                  [student-list]
 * @return {[Element]} extractFrom.children         [student-items]
 */
const extractChildren = extractFrom => extractFrom.children;

/**
 * [studentListParent globally saving the student-list]
 * @type {[Element]}
 */
const studentListParent = document.getElementsByClassName('student-list')[0];

/**
 * [studentListItemsLength saving length of all student items]
 * @type {[number]}
 */
const studentListItemsLength = studentListParent.children.length;

/**
 * [globalStudentList globally saving extracted children]
 * @type {[Element]}
 */
const globalStudentList = extractChildren(studentListParent);

/**
 * [addSearchBarListener bind an event listener to searchBar - binding on keyup]
 * @param {[Element]} searchBarContainer [searchBar container div]
 */
const addSearchBarListener = searchBarContainer => searchBarContainer.addEventListener('keyup', searchList, false);

/**
 * [hideAllResults function hides all results - students]
 * @return {[Element]} [list of all students]
 */
const hideAllResults = () => {
  for (let i = 0; i < studentListItemsLength; i++) {
    globalStudentList[i].style.display = 'none';
  }
};

/**
 * [activatePage function activates the clicked pagination page]
 * @param  {[Event]} event [DOMEvent in this case 'click']
 */
const activatePage = (event) => {
  const activePage = event.target.textContent;
  const pagination = event.target.parentNode.parentNode.children;

  for(let i = 0; i < pagination.length; i++) {
    if(i === activePage - 1 ) {
      pagination[i].firstChild.className = 'active';
    } else {
      pagination[i].firstChild.className = '';
    }
  }

  showPage(activePage, globalStudentList);
};

/**
 * [getStudentData extract student data extracts full name and email from underlying elements/students]
 * @param  {[Element]} studentList [list of all students]
 * @return {[array]}             [array of objects - name and email]
 */
const getStudentData = (studentList) => {
  const studentsArray = [];
  for(let i = 0; i < studentList.length; i++ ) {
    let studentData = {};
    studentData.studentName = studentList[i].getElementsByTagName('H3')[0].textContent;
    studentData.studentEmail = studentList[i].getElementsByTagName('SPAN')[0].textContent;
    studentsArray.push(studentData);
  }
  return studentsArray;
};

/**
 * [noStudentsFound if no search results are found hide all elements in list and append message]
 * @return {[void]} [function directly appends the div to the DOM]
 */
const noStudentsFound = () => {
  const page = document.getElementsByClassName('page')[0];
  const notFoundH1 = document.createElement('H1');
  notFoundH1.id = 'not-found';
  notFoundH1.textContent = 'NO STUDENTS FOUND';

  hideAllResults();

  page.appendChild(notFoundH1);
};

/**
 * [checkMatchingStudents compare input value with student list]
 * @param  {[Element]} studentsArray   [student-list]
 * @param  {[array]} studentDomArray [array of extracted data for student]
 * @param  {[string]} searchValue     [the current value in input element]
 * @return {[array]}                 [array of matched variables]
 */
const checkMatchingStudents = (studentsArray, studentDomArray, searchValue) => {
  const matchedStudents = [];
  const regex = new RegExp('(' + searchValue + ')', 'gi');
  const studentsArrayLength = studentsArray.length;

  for(let i = 0; i < studentsArrayLength; i++) {
    if(regex.test(studentsArray[i].studentName) || regex.test(studentsArray[i].studentEmail)) {
      matchedStudents.push(studentDomArray[i]);
    }
  }

  return matchedStudents;
};

/**
 * [removePagination remove pagination div]
 * @return {[void]} [no return]
 */
const removePagination = () => {
  const pagination = document.getElementsByClassName('pagination')[0];

  if( pagination !== undefined) {
    pagination.remove();
  }
};

/**
 * [removeNotFound remove no students found message]
 * @return {[void]} [no return value]
 */
const removeNotFound = () => {
  const noStudentsFound = document.getElementById('not-found');

  if(noStudentsFound !== null) {
    noStudentsFound.remove();
  }
};

/**
 * [searchList function searches for matching data between the input value and student-list]
 * @param  {[Event]} event [DOM Event - Keyup]
 * @return {[void]}       [no return value]
 */
const searchList = (event) => {
  const searchValue = event.target.value;
  const matched = checkMatchingStudents(getStudentData(globalStudentList), globalStudentList, searchValue);

  removePagination();
  removeNotFound();

  if(matched.length === 0 ) {
    noStudentsFound();
  } else if(matched.length >= 11 ) {
    appendPageLinks(matched);
    showPage(1, matched);
  } else {
    showPage(1, matched);
  }
};

/**
 * [addPaginationListener add EventListener to paginationDiv]
 * @param {[void]} paginationDiv [no return value]
 */
const addPaginationListener = paginationDiv  => paginationDiv.addEventListener('click', activatePage, false);

/**
 * [determinePages function calculates how many pages should be created]
 * @param  {[Element]} studentList [list of students]
 * @return {[number]}             [number of how many pages should be created]
 */
const determinePages = studentList => Math.ceil(studentList.length / 10);

/**
 * [showPage function that shows corresponding student items e.g. page]
 * @param  {[number]} pageNumber  [selected pagination page]
 * @param  {[Element]} studentList [list of students]
 * @return {[void]}             [no return value]
 */
const showPage = (pageNumber, studentList) => {
  let startPoint;

  if(pageNumber === 1){
    startPoint = 0;
  } else {
    startPoint = (pageNumber - 1) * 10;
  }
  const endPoint = startPoint + 10;

  hideAllResults();

  for (let i = startPoint; i < endPoint; i++) {
    if(studentList[i] !== undefined) {
      studentList[i].style.display = 'block';
    }
  }
};

/**
 * [createPaginationLinks function creates the pagination template]
 * @param  {[number]} pages [number of li elements to create]
 * @return {[Element]}       [return the pagination div]
 */
const createPaginationLinks = (pages) => {
  const paginationDiv = document.createElement('DIV');
  paginationDiv.className = 'pagination';
  const paginationUl = document.createElement('UL');

  for (let i = 0; i < pages; i++) {
    const li = document.createElement('LI');
    const anchor = document.createElement('A');
    anchor.setAttribute('href', '#');

    if (i === 0) {
      anchor.className = 'active';
    }

    anchor.textContent = i + 1;

    li.appendChild(anchor);
    paginationUl.appendChild(li);
  }

  paginationDiv.appendChild(paginationUl);
  return paginationDiv;
};

/**
 * [appendPageLinks function appends the created pagination div to a parent element and adds a EventListener]
 * @param  {[Element]} studentList [list of students]
 * @return {[void]}             [no return value]
 */
const appendPageLinks = (studentList) => {
  const paginationDivParent = document.getElementsByClassName('page')[0];
  const paginationDiv = createPaginationLinks(determinePages(studentList));

  addPaginationListener(paginationDiv);

  paginationDivParent.appendChild(paginationDiv);
};

/**
 * [clearSearchInput clears the text/search value in input element, removes not found if present, and repaints pagination]
 * @param  {[Event]} event [click event when the button is clicked]
 * @return {[void]}       [no return value]
 */
const clearSearchInput = (event) => {
  event.target.previousSibling.value = '';
  removeNotFound();
  appendPageLinks(globalStudentList);
  showPage(1, globalStudentList);
};

const appendClearSearchListener = (searchBar) => searchBar.addEventListener('click', clearSearchInput, false);

/**
 * [createSearchBar function creates a searchBar template]
 * @return {[Element]} [created searchBar div]
 */
const createSearchBar = () => {
  const studentSearchDiv = document.createElement('DIV');
  studentSearchDiv.className = 'student-search';

  const inputDiv = document.createElement('INPUT');
  inputDiv.setAttribute('placeholder', 'Search for students...');
  studentSearchDiv.appendChild(inputDiv);

  const searchButton = document.createElement('BUTTON');
  searchButton.textContent = 'Clear';
  appendClearSearchListener(searchButton);
  studentSearchDiv.appendChild(searchButton);

  return studentSearchDiv;
};

/**
 * [selectSearchBarParent get the parent element for searchBar binding]
 * @return {[Element]} [save parent where the searchBar should be appended]
 */
const selectSearchBarParent = () => document.getElementsByClassName('page-header cf')[0];

/**
 * [appendSearchBarToParent appends searchBar to the DOM - to the selected parent]
 * @param  {[Element]} searchBarParent [which parent to bind to]
 * @param  {[Element]} searchBar       [created searchBar to bind]
 * @return {[void]}                 [no return value]
 */
const appendSearchBarToParent = (searchBarParent, searchBar) => searchBarParent.appendChild(searchBar);

/**
 * [main starting program function - here's where the magic begins ;)]
 * @param  {[Element]} studentList [the student-list element in HTML to work on]
 * @return {[void]}             [no return value]
 */
function main (studentList) {
  showPage(1, studentList);
  appendPageLinks(studentList);
  addSearchBarListener(appendSearchBarToParent(selectSearchBarParent(), createSearchBar()));
}

/**
 * start program execution
 */
main(globalStudentList);
