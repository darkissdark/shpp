document.addEventListener("DOMContentLoaded", function () {
  showTask();
  const csvInput = document.getElementById("csvInput");
  const textInput = document.getElementById("textToReplace");
  const output = document.getElementById("csvOutput");

  let replaceFn = csvToObject(csvInput.value);

  function updateOutput() {
    output.innerHTML = replaceFn(textInput.value);
  }

  csvInput.addEventListener("input", () => {
    replaceFn = csvToObject(csvInput.value);
    updateOutput();
  });

  textInput.addEventListener("input", updateOutput);

  updateOutput();
});

function showTask() {
  document.querySelectorAll(".task.active").forEach((task) => {
    task.classList.remove("active");
  });

  const selectedTaskId = document.getElementById("taskSelector").value;
  document.getElementById(selectedTaskId).classList.add("active");
}

// Task 1: Hide methods
const square = document.getElementById("blackSquare");

function hideWithCSS() {
  square.style.display = "none";
}

function hideWithJS() {
  square.remove();
}

function hideWithCSSJS() {
  square.classList.add("hidden");
}

// Task 2: Toggle visibility
function toggleVisibility() {
  const square = document.getElementById("blackSquare2");
  square.classList.toggle("hidden");
}

// Task 3: Toggle all squares
function toggleAllSquares() {
  const squares = document.querySelectorAll("#task3 .black-square");
  squares.forEach((square) => {
    square.classList.toggle("hidden");
  });
}

// Task 4: Toggle by selector
function toggleBySelector() {
  const selector = document.getElementById("selectorInput").value;
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.classList.toggle("hidden");
  });
}

// Task 5: Yellow square click handler
let yellowSquareClickCount = 0;
document.getElementById("yellowSquare").addEventListener("click", function () {
  if (yellowSquareClickCount === 0) {
    alert("Привіт");
    yellowSquareClickCount++;
  } else {
    this.style.display = "none";
  }
});

// Task 6: Red square on hover
const hoverButton = document.getElementById("hoverButton");
const redSquare = document.getElementById("redSquare");
hoverButton.addEventListener("mouseenter", function () {
  redSquare.style.display = "block";
});

hoverButton.addEventListener("mouseleave", function () {
  redSquare.style.display = "none";
});

// Task 7: Green rectangle on focus
const focusInput = document.getElementById("focusInput");
const greenRectangle = document.getElementById("greenRectangle");
focusInput.addEventListener("focus", function () {
  greenRectangle.style.display = "block";
});

focusInput.addEventListener("input", function () {
  greenRectangle.style.display = "none";
});

// Task 8: Show image from URL
function showImage() {
  const url = document.getElementById("imageUrl").value;
  const container = document.getElementById("imageContainer");
  container.innerHTML = `<img src="${url}" alt="Loaded image" style="max-width: 200px; margin: 10px 0 0;">`;
}

// Task 9: Show multiple images
function showMultipleImages() {
  const urls = document.getElementById("imageUrls").value.split("\n");
  const container = document.getElementById("multipleImagesContainer");
  container.innerHTML = "";
  urls.forEach((url) => {
    if (url.trim()) {
      container.innerHTML += `<img src="${url.trim()}" alt="Loaded image" style="max-width: 200px; margin: 10px 10px 0 0;">`;
    }
  });
}

// Task 10-12: Coordinates and location info
document.addEventListener("mousemove", function (e) {
  document.getElementById(
    "mouseCoords"
  ).innerHTML = `X: ${e.clientX}, Y: ${e.clientY}`;
});

document.getElementById(
  "browserLang"
).innerHTML = `Browser Language: ${navigator.language}`;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    document.getElementById(
      "locationCoords"
    ).innerHTML = `Ш: ${position.coords.latitude}, Д: ${position.coords.longitude}`;
  });
}

// Task 13: Editable blocks with storage
// localStorage
const localStorageBlock = document.getElementById("localStorageBlock");
localStorageBlock.innerHTML = localStorage.getItem("localStorageContent");
localStorageBlock.addEventListener("input", function () {
  localStorage.setItem("localStorageContent", this.innerHTML);
});

// cookies
const cookiesBlock = document.getElementById("cookiesBlock");
cookiesBlock.innerHTML = getCookie("cookiesBlock");
cookiesBlock.addEventListener("input", function () {
  document.cookie = `cookiesBlock=${this.innerHTML}`;
});

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
}

// sessionStorage
const sessionStorageBlock = document.getElementById("sessionStorageBlock");
sessionStorageBlock.innerHTML = sessionStorage.getItem("sessionStorageContent");
sessionStorageBlock.addEventListener("input", function () {
  sessionStorage.setItem("sessionStorageContent", this.innerHTML);
});

// Task 14: Scroll to top button
window.addEventListener("scroll", function () {
  const scrollToTopButton = document.getElementById("scrollToTop");
  if (window.pageYOffset > this.window.innerHeight) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Task 15: Nested blocks
document.getElementById("innerBlock").addEventListener("click", function (e) {
  e.stopPropagation();
  alert("Inner block clicked");
});

document.getElementById("outerBlock").addEventListener("click", function () {
  alert("Outer block clicked");
});

// Task 16: Overlay
function showOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  document.body.style.overflow = "hidden";
}

document.getElementById("overlay").addEventListener("click", function () {
  this.style.display = "none";
  document.body.style.overflow = "auto";
});

// Task 17: Form submit prevention
document
  .getElementById("preventSubmitForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
  });

// Task 18: File input with drag and drop
const fileInputContainer = document.getElementById("fileInputContainer");
const fileInput = document.getElementById("fileInput");

fileInputContainer.addEventListener("dragover", function (e) {
  e.preventDefault();
  this.classList.add("drag-over");
});

fileInputContainer.addEventListener("dragleave", function () {
  this.classList.remove("drag-over");
});

fileInputContainer.addEventListener("drop", function (e) {
  e.preventDefault();
  this.classList.remove("drag-over");
  fileInput.files = e.dataTransfer.files;
  updateFileInputUI();
});

fileInput.addEventListener("change", updateFileInputUI);

function updateFileInputUI() {
  if (fileInput.files.length > 0) {
    fileInputContainer.classList.add("has-file");
    fileInputContainer.querySelector("label").innerHTML =
      fileInput.files[0].name;
  } else {
    fileInputContainer.classList.remove("has-file");
    fileInputContainer.querySelector("label").innerHTML =
      "Drag and drop files here or click to select";
  }
}

// Task 19: CSV Rich Text
function csvToObject(data) {
  const csvInput = data
    .split("\n")
    .filter((row) => row.trim() !== "" && !row.startsWith("#"))
    .map((row) => {
      const fields = row.split(",").filter((field) => field.trim() !== "");
      return {
        x: fields[0],
        y: fields[1],
        name: fields[2],
        population: fields[3],
      };
    })
    .reduce((acc, item) => {
      if (!acc.some((city) => city.name === item.name)) {
        acc.push(item);
      }
      return acc;
    }, [])
    .sort((a, b) => b.population - a.population)
    .slice(0, 10)
    .reduce((acc, item, index) => {
      acc[item.name] = { population: +item.population, rank: 1 + index };
      return acc;
    }, {});

  return function (text) {
    let result = text;

    for (const cityName in csvInput) {
      const { population, rank } = csvInput[cityName];
      const additionalText = `${cityName} (${rank} місце в ТОП-10 найбільших міст України, населення: ${pluralizeUkrainian(
        population,
        ["людина", "людини", "людей"]
      )})`;
      result = result.replace(cityName, additionalText);
    }

    return result;
  };

  function pluralizeUkrainian(count, [one, few, many]) {
    let plural = many;
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) plural = one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) plural = few;
    return `${count} ${plural}`;
  }
}
