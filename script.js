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

const setKeyboardState = (disabled) => {
  keyboard.querySelectorAll("button").forEach((btn) => {
    btn.disabled = disabled;

    btn.classList.toggle("keyboard__key--disabled", disabled);
  });
};

const startGame = () => {
  guessedLetters = [];
  incorrectGuesses = 0;
  message.textContent = "";
  message.className = "hangman__message";
  const randomIndex = Math.floor(Math.random() * words.length);
  answer = words[randomIndex].toLowerCase();
  setKeyboardState(false);
  renderWords();
};

const renderWords = () => {
  const render = answer
    .split("")
    .map((char) => (guessedLetters.includes(char) ? char.toUpperCase() : "_"))
    .join(" ");
  wordDisplay.textContent = render;
  image.src = "assets/img/h-" + incorrectGuesses + ".jpg";
};

const guess = (letter) => {
  letter = letter.toLowerCase();
  if (
    guessedLetters.includes(letter) ||
    incorrectGuesses >= maxGuesses ||
    !answer
  )
    return;
  guessedLetters.push(letter);
  const button = document.querySelector("#btn-" + letter);
  if (button) {
    button.disabled = true;
    button.classList.add("keyboard__key--disabled");
  }
  if (!answer.includes(letter)) {
    incorrectGuesses++;
  }
  renderWords();
  gameResult();
};

const gameResult = () => {
  const won = answer.split("").every((l) => guessedLetters.includes(l));
  const lost = incorrectGuesses >= maxGuesses;

  if (!won && !lost) return;

  if (won) {
    message.textContent = "Congratuation!";

    setKeyboardState(true);
  } else {
    message.textContent = `Game over, the word was: ${answer}`;

    setKeyboardState(true);
  }
  updateStats();
};

const restartGame = () => {
  startGame();
};

resetBtn.addEventListener("click", restartGame);

const play = async () => {
  await loadWords();

  displayKeyboard();

  startGame();
};

play();
