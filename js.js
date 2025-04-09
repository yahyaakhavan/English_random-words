const fileInput = document.getElementById("selected-btn");
const overlay = document.getElementById("overlay");
const overlayMessage = document.getElementById("overlayMessage");
const firstWord = document.getElementById("first-word");
const secondWord = document.getElementById("second-word");
const createRandomBtn = document.getElementById("random-word");
const wordsInput = document.getElementById("new-words");
const addWords = document.getElementById("add-words");
let words = [];
let timerID;
const waitingTimer = 1500;

createRandomBtn.addEventListener("click", (e) => {
  createRandomWord();
});
addWords.addEventListener("click", () => {
  addNewWords();
});

fileInput.addEventListener("change", (e) => {
  wordsToArray(e.target.files[0]);
});

function wordsToArray(files) {
  if (!files) {
    showOverlay("No file selected.");
    setTimeout(hideOverlay, 2000);
    return;
  }
  if (files.type !== "text/plain") {
    showOverlay("Unsupported file type. Please select a .txt file.");
    setTimeout(hideOverlay, 3000);
    fileInput.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    words = text.split(/\r?\n/).filter(Boolean);
    words = words.map((item) => {
      return item.trim();
    });
  };
  reader.onerror = (e) => {
    showOverlay(`Error reading file: ${e.target.error}`);
    setTimeout(hideOverlay, 3000);
    fileInput.value = "";
  };
  reader.readAsText(files);
}

function createRandomWord() {
  if (words.length === 0) {
    showOverlay("first select the file");
    setTimeout(hideOverlay, 3000);
    return;
  }
  let randomNumbers = [];
  for (let i = 2; i > 0; i--) {
    randomNumbers.push(Math.floor(Math.random(words.length) * words.length));
  }
  firstWord.value = words[randomNumbers[0]];

  secondWord.value = words[randomNumbers[1]];
}
function addNewWords() {
  clearTimeout(timerID);

  if (words.length === 0) {
    showOverlay("first select the file");
    setTimeout(hideOverlay, 3000);
    return;
  }
  if (wordsInput.value == "") {
    return;
  }
  const newWord = wordsInput.value
    .split(/\r?\n/)
    .map((item) => {
      return item.trim();
    })
    .filter(Boolean);
  words.push(...newWord);
  timerID = setTimeout(() => {
    const blob = new Blob([words.join("\n")], { type: "text/plain" });
    saveAs(blob, "updated-word-list.txt");
  }, waitingTimer);
}
function showOverlay(message) {
  overlayMessage.textContent = message;
  overlay.style.display = "flex";
}

function hideOverlay() {
  overlay.style.display = "none";
}
