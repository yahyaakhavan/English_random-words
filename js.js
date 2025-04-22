const fileInput = document.getElementById("selected-btn");
const overlay = document.getElementById("overlay");
const overlayMessage = document.getElementById("overlayMessage");
const firstWord = document.getElementById("first-word");
const secondWord = document.getElementById("second-word");
const createRandomBtn = document.getElementById("random-word");
const wordsInput = document.getElementById("new-words");
const addWords = document.getElementById("add-words");
const reviewCheckBox = document.getElementById("review__checkBox");
const reviewTextarea = document.getElementById("review");
const addCheckBox1 = document.getElementById("addToReview1");
const addCheckBox2 = document.getElementById("addToReview2");
let words = [];
let timerID;
const waitingTimer = 1500;
addCheckBox1.addEventListener("change", (e) => {
  if (e.target.checked) {
    addWordToReviewList(firstWord.value);
  } else {
    removeWordFromReviewList(firstWord.value);
  }
});
addCheckBox2.addEventListener("change", (e) => {
  if (e.target.checked) {
    addWordToReviewList(secondWord.value);
  } else {
    removeWordFromReviewList(secondWord.value);
  }
});
createRandomBtn.addEventListener("click", (e) => {
  createRandomWord();
});
addWords.addEventListener("click", () => {
  addNewWords();
});

fileInput.addEventListener("change", (e) => {
  wordsToArray(e.target.files[0]);
});
reviewCheckBox.addEventListener("change", (e) => {
  if (e.target.checked) {
    getReviewWords(words);
  } else {
    reviewTextarea.value = "";
  }
});
function addWordToReviewList(word) {
  const index = words.findIndex((item) => {
    return item.trim() === word.trim();
  });
  words[index] = `${words[index]} .`;
}
function removeWordFromReviewList(word) {
  const n = `${word.trim()} .`;
  console.log(word);
  const index = words.findIndex((item) => {
    console.log(item, n);
    return item.trim() === n.trim();
  });
  const mustBeCleared = word.split(".");
  words[index] = mustBeCleared[0].trim();
  console.log(words, mustBeCleared);
}
function getReviewWords(words) {
  let reviewWordsList = [];
  if (words.length === 0) {
    showOverlay("first select the file");
    setTimeout(hideOverlay, 3000);
    return;
  }
  words.map((word) => {
    if (word.includes(".")) {
      reviewWordsList.push(word.split(".")[0]);
    }
  });
  reviewWordsList.map((item) => {
    reviewTextarea.value += `${item} \n`;
  });
}
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
  if (words[randomNumbers[0]].includes(".")) {
    addCheckBox1.checked = true;
  } else {
    addCheckBox1.checked = false;
  }
  if (words[randomNumbers[1]].includes(".")) {
    addCheckBox2.checked = true;
  } else {
    addCheckBox2.checked = false;
  }
  if (words[randomNumbers[0]] === words[randomNumbers[1]]) {
    addCheckBox2.disabled = true;
  } else {
    addCheckBox2.disabled = false;
  }
  firstWord.value = words[randomNumbers[0]].split(".")[0];

  secondWord.value = words[randomNumbers[1]].split(".")[0];
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
