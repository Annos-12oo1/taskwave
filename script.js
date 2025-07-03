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
          <button onclick="toggleDone(${index})">✅</button>
          <button onclick="deleteTask(${index})">🗑️</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  };

  const toggleDone = (i) => {
    tasks[i].done = !tasks[i].done;
    saveTasks();
    renderTasks();
  };

  const deleteTask = (i) => {
    tasks.splice(i, 1);
    saveTasks();
    renderTasks();
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const category = document.getElementById('task-category').value.trim();
    const priority = document.getElementById('task-priority').value;
    const time = document.getElementById('task-time').value;

    if (!title || !time) return alert('Please fill in required fields.');

    tasks.push({ title, category, priority, time, done: false });
    saveTasks();
    renderTasks();
    form.reset();
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  const checkAlarms = () => {
    const now = new Date().toISOString().slice(0, 16);
    tasks.forEach(task => {
      if (!task.done && task.time === now) {
        alert(`🔔 Reminder: ${task.title}`);
        task.done = true;
      }
    });
    saveTasks();
    renderTasks();
  };

  setInterval(checkAlarms, 60000);
  renderTasks();

  // Pomodoro timer logic
  let timerDisplay = document.getElementById("timer");
  let startBtn = document.getElementById("start-btn");
  let pauseBtn = document.getElementById("pause-btn");
  let resetBtn = document.getElementById("reset-btn");

  let timer;
  let timeLeft = 25 * 60;
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
    timeLeft = 25 * 60;
    isRunning = false;
    updateTimerDisplay();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  updateTimerDisplay(); // Show initial time
});
