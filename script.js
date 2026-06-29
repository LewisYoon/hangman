let words = [];
let answer = "";
let guessedLetters = [];
let incorrectGuesses = 0;
const maxGuesses = 10;
let wins = 0;
let losses = 0;
let usedWords = [];

// DOM Elements
const image = document.querySelector("#image");
const wordDisplay = document.querySelector("#word-display");
const keyboard = document.querySelector("#keyboard");
const message = document.querySelector("#message");
const resetBtn = document.querySelector("#reset-btn");

const loadWords = async () => {
  try {
    const response = await fetch("./assets/example-words.json");
    words = await response.json();
    console.log(words);
  } catch (err) {
    console.error("Failed to load words:", err);
    throw err;
  }
};

const displayKeyboard = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < alphabet.length; i++) {
    const char = alphabet[i];
    const btn = document.createElement("button");
    btn.id = "btn-" + char;
    btn.className = "keyboard__key";
    btn.textContent = char.toUpperCase();
    btn.addEventListener("click", () => guess(char));
    keyboard.appendChild(btn);
  }
};

const startGame = () => {
  guessedLetters = [];
  incorrectGuesses = 0;
  message.textContent = "";
  message.className = "hangman__message";
  const randomIndex = Math.floor(Math.random() * words.length);
  answer = words[randomIndex].toLowerCase();
  renderWords();
};

const renderWords = () => {
  let render = "";
  for (let i = 0; i < answer.length; i++) {
    const char = answer[i];
    if (guessedLetters.includes(char)) {
      render += char.toUpperCase() + " ";
    } else {
      render += "_ ";
    }
  }
  wordDisplay.textContent = render.trim();
  image.src = "assets/img/h-" + incorrectGuesses + ".jpg";
};

const play = async () => {
  await loadWords();

  displayKeyboard();

  startGame();
};

play();
