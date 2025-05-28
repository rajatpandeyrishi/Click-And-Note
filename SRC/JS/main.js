// Selects the "Add Note" box element that triggers the popup for creating a new note
const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"), // Selects the popup overlay container for adding/editing notes
  popupTitle = popupBox.querySelector("header p"), // Selects the <p> element inside the popup header to display the popup title to Add or Edit
  closeIcon = popupBox.querySelector("header i"), // Selects the close icon in the popup header to dismiss the popup
  titleTag = popupBox.querySelector("input"), // Selects the input field for the note title inside the popup
  descTag = popupBox.querySelector("textarea"), // Selects the textarea for the note description inside the popup
  addBtn = popupBox.querySelector("button"); // Selects the button used to submit the note form (add or update)

// Defines an array of month names for formatting note creation dates
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Loads notes from localStorage if available, otherwise initializes an empty array
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// Tracks whether the popup is being used to update an existing note (true) or add a new one (false)
let isUpdate = false,
  // Stores the index of the note being updated (if any)
  updateId;

// Event listener for opening the popup to add a new note
addBox.addEventListener("click", () => {
  popupTitle.innerText = "New Note"; // Sets the popup title for adding
  addBtn.innerText = "Done"; // Sets the button text for adding
  popupBox.classList.add("show"); // Displays the popup overlay
  document.querySelector("body").style.overflow = "hidden"; // Prevents background scrolling when popup is open
  if (window.innerWidth > 660) titleTag.focus(); // Focuses the title input on larger screens for better UX
});

// Event listener for closing the popup and resetting input fields
closeIcon.addEventListener("click", () => {
  isUpdate = false; // Resets update mode
  titleTag.value = descTag.value = ""; // Clears both input fields
  popupBox.classList.remove("show"); // Hides the popup overlay
  document.querySelector("body").style.overflow = "auto"; // Restores background scrolling
});

// Renders all notes from the notes array (local storage) to the UI
function showNotes() {
  if (!notes) return; // If notes array is empty, do nothing
  document.querySelectorAll(".note").forEach((li) => li.remove()); // Removes all existing note elements from the DOM to avoid duplicates
  // Iterates over each note and creates its HTML structure
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", "<br/>"); // Converts newlines in the description to <br/> for HTML display
    // Constructs the note card HTML with title, description, date, and settings menu
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    // Inserts the new note card into the DOM immediately after the "Add Note" box
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

// Initial call to render notes when the page loads
showNotes();

// Displays the settings menu (edit/delete) for a specific note
function showMenu(elem) {
  elem.parentElement.classList.add("show"); // Shows the menu by adding the 'show' class
  // Adds a one-time event listener to the document to close the menu when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    } // If the click is not on the same icon, hide the menu
  });
}

// Deletes a note by its index in the notes array
function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?"); // Asks for user confirmation
  if (!confirmDel) return; // If user cancels, do nothing
  notes.splice(noteId, 1); // Removes the note from the array
  localStorage.setItem("notes", JSON.stringify(notes)); // Updates localStorage with the new notes array
  showNotes(); // Re-renders the notes list
}

// Prepares the popup for updating an existing note
function updateNote(noteId, title, filterDesc) {
  // Converts <br/> tags back to newlines for the textarea
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId; // Stores the index of the note being updated
  isUpdate = true; // Sets update mode
  addBox.click(); // Opens the popup
  titleTag.value = title; // Fills the title input with the note's title
  descTag.value = description; // Fills the textarea with the note's description
  popupTitle.innerText = "Update a Note"; // Sets the popup title for updating
  addBtn.innerText = "Update Note"; // Sets the button text for updating
}

// Handles adding a new note or updating an existing one when the form button is clicked
addBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Prevents the default form submission behavior
  let title = titleTag.value.trim(), // Gets and trims the title input value
    description = descTag.value.trim(); // Gets and trims the description textarea value

  // Only proceed if at least one field is filled
  if (title || description) {
    let currentDate = new Date(), // Gets the current date
      month = months[currentDate.getMonth()], // Gets the current month name
      day = currentDate.getDate(), // Gets the current day of the month
      year = currentDate.getFullYear(); // Gets the current year

    // Creates a note object with title, description, and formatted date
    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    if (!isUpdate) {
      notes.push(noteInfo); // Adds the new note to the array
    } else {
      isUpdate = false; // Resets update mode
      notes[updateId] = noteInfo; // Updates the existing note in the array
    }
    localStorage.setItem("notes", JSON.stringify(notes)); // Saves the updated notes array to localStorage
    showNotes(); // Re-renders the notes list
    closeIcon.click(); // Closes the popup and resets fields
  }
});

// Sets the current year dynamically in the footer
document.addEventListener("DOMContentLoaded", function () {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
