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
const winsCount = document.querySelector("#wins-count");
const lossesCount = document.querySelector("#losses-count");
const usedWordsList = document.querySelector("#used-words-list");

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
    btn.className = "hangman__keyboard-key";
    btn.textContent = char.toUpperCase();
    btn.addEventListener("click", () => guess(char));
    keyboard.appendChild(btn);
  }
};

const setKeyboardState = (disabled) => {
  keyboard.querySelectorAll("button").forEach((btn) => {
    btn.disabled = disabled;

    btn.classList.toggle("hangman__keyboard-key--disabled", disabled);
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
    button.classList.add("hangman__keyboard-key--disabled");
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
    message.classList.add("hangman__message--win");
    wins++;
    usedWords.push({ word: answer, status: "won" });
    setKeyboardState(true);
  } else {
    message.textContent = `Game over, the word was: ${answer}`;
    message.classList.add("hangman__message--loss");
    losses++;
    usedWords.push({ word: answer, status: "lost" });

    setKeyboardState(true);
  }
  updateStats();
};

const updateStats = () => {
  winsCount.textContent = wins;

  lossesCount.textContent = losses;

  usedWordsList.innerHTML = "";

  usedWords.forEach(({ word, status }) => {
    const li = document.createElement("li");

    li.textContent = word.toUpperCase();

    li.className = status === "won" ? "won" : "lost";

    usedWordsList.appendChild(li);
  });
};

const restartGame = () => {
  startGame();
};

resetBtn.addEventListener("click", restartGame);

export const play = async () => {
  await loadWords();
  displayKeyboard();
  startGame();
};
