const questionBank = {
  "HR": [
    { q: "Tell me about yourself.", hint: "Mention your education, interests, strengths, and career goal." },
    { q: "What are your strengths?", hint: "Choose 1–2 strengths and give a short, real example." },
    { q: "Why should we hire you as a fresher?", hint: "Connect your willingness to learn, relevant skills, and the role." },
    { q: "What is your career goal?", hint: "Share a realistic short-term learning goal and a longer-term direction." },
    { q: "Describe a challenge you handled.", hint: "Use a simple situation, action, and result structure." }
  ],
  "Web Development": [
    { q: "What is the difference between HTML, CSS, and JavaScript?", hint: "Explain structure, presentation, and interactivity." },
    { q: "What is responsive web design?", hint: "Explain how a page adapts to different screen sizes." },
    { q: "What is the purpose of semantic HTML?", hint: "Mention meaningful tags, accessibility, and readable structure." },
    { q: "What is the CSS box model?", hint: "Include content, padding, border, and margin." },
    { q: "What is the DOM in JavaScript?", hint: "Explain how JavaScript can read and update a page's elements." }
  ],
  "Python": [
    { q: "What are variables in Python?", hint: "Explain that variables refer to values and give a small example." },
    { q: "What is the difference between a list and a tuple?", hint: "Mention ordering and whether the collection can be changed." },
    { q: "What is a function?", hint: "Explain reusable code and mention def in Python." },
    { q: "What is a loop used for?", hint: "Explain repeating a task with for or while." },
    { q: "What is the difference between == and = ?", hint: "Explain comparison versus assignment." }
  ]
};

const categorySelect = document.getElementById("category");
const questionText = document.getElementById("question-text");
const questionHint = document.getElementById("question-hint");
const questionCount = document.getElementById("question-count");
const answerInput = document.getElementById("answer");
const characterCount = document.getElementById("character-count");
const feedback = document.getElementById("feedback");
const tipsBox = document.getElementById("answer-tips");
let questionIndex = 0;
let selectedRating = 0;

function currentQuestion() {
  return questionBank[categorySelect.value][questionIndex];
}
function showQuestion() {
  const question = currentQuestion();
  questionText.textContent = question.q;
  questionHint.textContent = question.hint;
  questionCount.textContent = `Question ${questionIndex + 1} of ${questionBank[categorySelect.value].length}`;
  answerInput.value = "";
  characterCount.textContent = "0 characters";
  feedback.textContent = "";
  tipsBox.classList.add("hidden");
  selectedRating = 0;
  document.querySelectorAll(".rating-button").forEach(button => button.classList.remove("selected"));
}
function updateHistory() {
  const history = JSON.parse(localStorage.getItem("prepai-sessions") || "[]");
  document.getElementById("total-sessions").textContent = history.length;
  const ratings = history.filter(item => item.rating > 0).map(item => item.rating);
  document.getElementById("average-rating").textContent = ratings.length
    ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1) + " / 5"
    : "—";
  document.getElementById("category-count").textContent = new Set(history.map(item => item.category)).size;
  const list = document.getElementById("history-list");
  if (!history.length) {
    list.innerHTML = '<p class="empty-state">No sessions saved yet. Complete a practice question to see it here.</p>';
    return;
  }
  list.innerHTML = "";
  history.slice().reverse().forEach(item => {
    const row = document.createElement("article");
    row.className = "history-item";
    const details = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = item.question;
    const meta = document.createElement("p");
    meta.textContent = `${item.category} · ${item.date} · ${item.answerLength} characters`;
    const score = document.createElement("span");
    score.className = "history-score";
    score.textContent = item.rating ? `Confidence ${item.rating}/5` : "Not rated";
    details.append(title, meta);
    row.append(details, score);
    list.appendChild(row);
  });
}
answerInput.addEventListener("input", () => {
  characterCount.textContent = `${answerInput.value.length} characters`;
});
categorySelect.addEventListener("change", () => {
  questionIndex = 0;
  showQuestion();
});
document.querySelectorAll(".rating-button").forEach(button => {
  button.addEventListener("click", () => {
    selectedRating = Number(button.dataset.rating);
    document.querySelectorAll(".rating-button").forEach(b => b.classList.toggle("selected", b === button));
  });
});
document.getElementById("hint-button").addEventListener("click", () => {
  tipsBox.classList.toggle("hidden");
});
document.getElementById("save-button").addEventListener("click", () => {
  const answer = answerInput.value.trim();
  if (!answer) {
    feedback.textContent = "Please type an answer before saving your practice.";
    answerInput.focus();
    return;
  }
  const history = JSON.parse(localStorage.getItem("prepai-sessions") || "[]");
  history.push({
    category: categorySelect.value,
    question: currentQuestion().q,
    answerLength: answer.length,
    rating: selectedRating,
    date: new Date().toLocaleDateString()
  });
  localStorage.setItem("prepai-sessions", JSON.stringify(history));
  feedback.textContent = "Practice saved! Your answer text is not stored—only the question, category, date, length, and confidence rating.";
  updateHistory();
});
document.getElementById("next-button").addEventListener("click", () => {
  questionIndex = (questionIndex + 1) % questionBank[categorySelect.value].length;
  showQuestion();
});
document.getElementById("clear-history").addEventListener("click", () => {
  if (confirm("Clear all saved practice history from this browser?")) {
    localStorage.removeItem("prepai-sessions");
    updateHistory();
    feedback.textContent = "Practice history cleared.";
  }
});
showQuestion();
updateHistory();
