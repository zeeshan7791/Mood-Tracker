console.log("hello");

const userMood = document.getElementById("user-mood");
const displayMood = document.getElementById("display-mood");
const logUserMoods = document.getElementById("filter-mood");
const clearMoods = document.getElementById("clearMoods");

// Load stored moods when the page loads
document.addEventListener("DOMContentLoaded", loadMoods);

userMood.addEventListener("input", storeUserMood);

function dateFormate(separator = "/") {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0"); // Ensures two-digit day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensures two-digit month (Months are zero-based)
  const year = date.getFullYear();

  return `${day}${separator}${month}${separator}${year}`;
}
// for adding previous dates to check filter

function formatDateString(dateStr, separator = "/") {
  // Split the date string (Assuming "DD/MM/YYYY" format)
  const [day, month, year] = dateStr.split("/").map(Number);

  // Create a new Date object
  const date = new Date(year, month - 1, day); // Month is zero-based in JS

  // Format the date using the same logic
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
  const formattedYear = date.getFullYear();

  return `${formattedDay}${separator}${formattedMonth}${separator}${formattedYear}`;
}

function storeUserMood() {
  const input = userMood.value.trim();

  if (!input) {
    return console.log("Enter a value");
  }

  let moods = JSON.parse(localStorage.getItem("mood")) || [];
  let day = dateFormate();
  // let formattedDate = formatDateString("19/03/2025");

  console.log(moods);
  moods.push({
    mood: input,
    day: day,
  });
  localStorage.setItem("mood", JSON.stringify(moods));

  displayMoods(moods);
}

// Function to load moods from localStorage on page load
function loadMoods() {
  let moods = JSON.parse(localStorage.getItem("mood")) || [];
  displayMoods(moods);
}

// Function to display moods in the UI
function displayMoods(moods) {
  displayMood.innerHTML = ""; // Clear existing content
  if (moods.length < 1) {
    displayMood.innerHTML = `<h1>No Mood exist</h1>`;
    return;
  }

  const moodMap = {}; // Object to store moods by date

  moods.forEach((mood) => {
    if (!moodMap[mood.day]) {
      moodMap[mood.day] = [];
    }
    moodMap[mood.day].push(mood.mood); // Store moods under the respective date
  });

  displayMood.innerHTML = ""; // Clear previous content

  Object.keys(moodMap).forEach((date) => {
    displayMood.innerHTML += `<p><strong>${date}</strong></p>`; // Display date once
    moodMap[date].forEach((mood) => {
      displayMood.innerHTML += `<p>${mood}</p>`; // Display moods under the date
    });
  });
}

// Clear localStorage and update UI
clearMoods.addEventListener("click", () => {
  console.log("click");
  localStorage.clear();
  displayMood.innerHTML = `<h1>No Mood exist</h1>`; // Clear the displayed moods
});

function formatDate(date) {
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
}

// Function to normalize date format (convert all to Date objects)
function parseDate(date) {
  if (typeof date === "string") {
    let [day, month, year] = date.split("/"); // Convert 'DD/MM/YYYY' to parts
    return new Date(`${year}-${month}-${day}`); // Convert to Date object
  }
  return new Date(date); // If already in timestamp format
}

// Function to get the start of today (Midnight)
function getStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Function to get the start of the current week (Sunday)
function getStartOfWeek(date) {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - dayOfWeek
  );
}

// Function to get the start of the current month (1st day)
function getStartOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Function to filter moods based on selected period and format dates properly
function filterMoods(period) {
  const today = new Date();
  const startOfToday = getStartOfDay(today);
  const startOfWeek = getStartOfWeek(today);
  const startOfMonth = getStartOfMonth(today);
  let moods = JSON.parse(localStorage.getItem("mood")) || [];

  let filteredMoods;

  if (period === "today") {
    filteredMoods = moods.filter(
      (mood) =>
        getStartOfDay(parseDate(mood.day)).getTime() === startOfToday.getTime()
    );
  } else if (period === "week") {
    filteredMoods = moods.filter(
      (mood) => parseDate(mood.day).getTime() >= startOfWeek.getTime()
    );
  } else if (period === "month") {
    filteredMoods = moods.filter(
      (mood) => parseDate(mood.day).getTime() >= startOfMonth.getTime()
    );
  } else {
    console.log("Invalid period selected!");
    return [];
  }

  // Convert `day` values into "DD/MM/YYYY" format before returning
  return filteredMoods.map((mood) => ({
    mood: mood.mood,
    day: formatDate(parseDate(mood.day)), // Format the date before returning
  }));
}

const moodDays = document.getElementById("moodDays");

moodDays.addEventListener("input", () => {
  let day = moodDays.value;
  console.log(day, "value of day");

  let dayBasedMoods = filterMoods(day);
  displayMoods(dayBasedMoods);
});
