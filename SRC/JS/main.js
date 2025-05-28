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
  popupTitle.innerText = "Add a new Note"; // Sets the popup title for adding
  addBtn.innerText = "Add Note"; // Sets the button text for adding
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
