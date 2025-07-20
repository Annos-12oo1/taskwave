document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const themeToggle = document.getElementById('toggle-theme');
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const renderTasks = () => {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `task-item priority-${task.priority} ${task.done ? 'done' : ''}`;
      li.innerHTML = `
        <div class="task-info">
          <div>
            <strong>${task.title}</strong> <br/>
            <small>${task.category || 'No category'}</small>
          </div>
          <div class="task-time">${new Date(task.time).toLocaleString()}</div>
        </div>
        <div class="task-controls">
          <button class="done-btn">✅</button>
          <button class="delete-btn">🗑️</button>
        </div>
      `;

      const doneBtn = li.querySelector(".done-btn");
      const deleteBtn = li.querySelector(".delete-btn");

      doneBtn.addEventListener("click", () => {
        tasks[index].done = !tasks[index].done;
        saveTasks();
        renderTasks();
      });

      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      taskList.appendChild(li);
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const category = document.getElementById('task-category').value.trim();
    const priority = document.getElementById('task-priority').value;
    const time = document.getElementById('task-time').value;

    if (!title || !time) return alert('Please fill in required fields.');

    tasks.push({ title, category, priority, time, done: false, reminded: false });
    saveTasks();
    renderTasks();
    form.reset();
  });

  // Theme toggle + persist
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });

  // Alarm System
  const checkAlarms = () => {
    const now = new Date();

    tasks.forEach(task => {
      const taskTime = new Date(task.time);
      const diff = Math.abs(taskTime - now);

      if (!task.done && !task.reminded && diff <= 30000) {
        alert(`🔔 Reminder: ${task.title}`);
        task.reminded = true;
      }
    });

    saveTasks();
    renderTasks();
  };

  setInterval(checkAlarms, 5000); // check every 5 seconds

  // Pomodoro timer
 let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("start-btn");
let pauseBtn = document.getElementById("pause-btn");
let resetBtn = document.getElementById("reset-btn");
let customMinutesInput = document.getElementById("custom-minutes");

let timer;
let timeLeft = parseInt(customMinutesInput.value) * 60;
let isRunning = false;

function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        alert("🍅 Pomodoro complete!");
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = parseInt(customMinutesInput.value) * 60;
  updateTimerDisplay();
}

customMinutesInput.addEventListener("change", () => {
  if (!isRunning) {
    timeLeft = parseInt(customMinutesInput.value) * 60;
    updateTimerDisplay();
  }
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateTimerDisplay();

  renderTasks();
});
