let currentQuestionIndex = 0;
let questions = [];
let timeLeft = 0;
let userAnswers = {};
let numberOfQuestion = 0;
let questionStatus = [];

window.onload = async function () {
  const topic = localStorage.getItem("selectedTopic");
  const set = localStorage.getItem("selectedSet");
  // console.log("Topic:", localStorage.getItem("selectedTopic"));
  // console.log("Set:", localStorage.getItem("selectedSet"));

  if (!topic || !set) {
    document.getElementById("quiz-container").innerText = "No set selected.";
    return;
  }

  document.getElementById("test-heading").innerText = `${topic} - ${set}`;

  const topicSlug = topic.toLowerCase().replace(/\s+/g, "-");
  const setSlug = set.toLowerCase();

  const url = `../Questions/Varbal/${topicSlug}/${setSlug}.json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    questions = data.questions;
    timeLeft = data.time; // ← Set time from JSON
    numberOfQuestion = data.totalQuestion;
    startTimer();
    showNextQuestion();
    showPrevQuestion();
    questionTracking(numberOfQuestion);

    // const quizContainer = document.getElementById("quiz-container");
    // data.questions.forEach((q, index) => {
    //   const qDiv = document.createElement("div");
    //   qDiv.innerHTML = `
    //       <p><b>Q${index + 1}: ${q.question}</b></p>
    //       ${q.options
    //         .map(
    //           (opt, i) =>
    //             `<label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label><br>`
    //         )
    //         .join("")}
    //       <hr>
    //     `;
    //   quizContainer.appendChild(qDiv);
    // });
  } catch (err) {
    console.error("Error loading quiz:", err);
    document.getElementById("quiz-container").innerText =
      "Unable to load questions.";
  }
};
//here creation of question area.
function showQuestion() {
  const quizContainer = document.getElementById("quiz-container");

  const q = questions[currentQuestionIndex];
  quizContainer.innerHTML = `
    <p><b>Q${currentQuestionIndex + 1}: ${q.question}</b></p>
    ${q.options
      .map(
        (opt) =>
          `<label><input type="radio" name="q${currentQuestionIndex}" value="${opt}" ${
            userAnswers[currentQuestionIndex] === opt ? "checked" : ""
          }> ${opt}</label><br>`
      )
      .join("")}
    <hr>
  `;
  // Save selected answer
  const inputs = quizContainer.querySelectorAll(
    `input[name="q${currentQuestionIndex}"]`
  );
  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      userAnswers[currentQuestionIndex] = e.target.value;
      updateStatus(currentQuestionIndex, "answered");
    });
  });
}
//previous button functionality
function showPrevQuestion() {
  if (currentQuestionIndex > 0) {
    if (!userAnswers[currentQuestionIndex]) {
    updateStatus(currentQuestionIndex, "visited");
  } else {
    updateStatus(currentQuestionIndex, "answered");
  }
    currentQuestionIndex--; //  move back first
    showQuestion(); //  now show that question
    updateStatus(currentQuestionIndex, "current");
  }
}
//next button functionality.
function showNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    if (!userAnswers[currentQuestionIndex]) {
    updateStatus(currentQuestionIndex, "visited");
  } else {
    updateStatus(currentQuestionIndex, "answered");
  }
    currentQuestionIndex++; // move forward first
    showQuestion();
    updateStatus(currentQuestionIndex, "current");
  }
}
//timer section start from here.
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    document.getElementById("timer").innerText = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }

    timeLeft--;
  }, 1000);
}

//marked for Review button sections
function markforReview(){
   if (currentQuestionIndex < questions.length - 1) {
    if (!userAnswers[currentQuestionIndex]) {
    updateStatus(currentQuestionIndex, "Marked");
  } else {
    updateStatus(currentQuestionIndex, "Marked");
  }
    currentQuestionIndex++; // move forward first
    showQuestion();
    updateStatus(currentQuestionIndex, "current");
  }
}


// result section start from here

function submitQuiz() {
  // Example logic
  //console.log("Submit button clicked");

  // Optional: check if questions array exists
  if (!questions) {
    alert("Questions not loaded.");
    return;
  }
  //question is loading
  clearInterval(timerInterval); // stop timer if any

  let score = 0;

  questions.forEach((q, index) => {
    if (userAnswers[index] === q.answer) {
      score++;
    }
  });

  // Show result modal
  document.getElementById("result-modal").style.display = "block";
  document.getElementById("result-score").innerText = `Score: ${score}`;
  document.getElementById(
    "result-total"
  ).innerText = `Total Questions: ${questions.length}`;
  document.getElementById(
    "result-time"
  ).innerText = `Time Remaining: ${formatTime(timeLeft)}`;
}
//close btn functionality
function closeModal(){
  let closeModal=document.querySelector('#result-modal');
  closeModal.style.display="none";
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let sec = seconds % 60;
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

// question tracking throught the question number
function questionTracking(numberOfQuestion) {
  const totalQuestions = numberOfQuestion;
  //const questionStatus = Array(totalQuestions).fill("not-visited"); // Default status

  const navContainer = document.getElementById("question-nav");

  // Generate Buttons
  for (let i = 0; i < totalQuestions; i++) {
    const btn = document.createElement("button");
    btn.innerText = i + 1;
    btn.className = `nav-btn ${questionStatus[i]}`;
    btn.dataset.index = i;

    // Add click listener to go to that question
    btn.addEventListener("click", () => {
      goToQuestion(i);
    });

    navContainer.appendChild(btn);
  }

  function goToQuestion(index) {
    //console.log("Navigating to question:", index + 1);

    if (userAnswers[currentQuestionIndex]) {
      updateStatus(currentQuestionIndex, "answered");
    } else {
      updateStatus(currentQuestionIndex, "visited");
    }

    currentQuestionIndex = index;
    showQuestion();
    updateStatus(index, "current");
  }
}

//update the current question status

function updateStatus(index, status) {
  questionStatus[index] = status;

  const buttons = document.querySelectorAll(".nav-btn");
  if (buttons[index]) {
    buttons[index].className = `nav-btn ${status}`;
  }
}
