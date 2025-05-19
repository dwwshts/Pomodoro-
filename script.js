// Check for notification permission
if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

// Timer variables
let timeLeft = 30 * 60; // 30 minutes in seconds
let timerId = null;
let isStudySession = true;

// DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const sessionType = document.getElementById('session-type');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const studyTimeInput = document.getElementById('study-time');
const breakTimeInput = document.getElementById('break-time');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const reminderTime = document.getElementById('reminder-time');
const tasksList = document.getElementById('tasks');

// Timer functions
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;
                switchSession();
            }
        }, 1000);
        
        startBtn.textContent = 'Start';
    }
}

function pauseTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'Resume';
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = studyTimeInput.value * 60;
    isStudySession = true;
    sessionType.textContent = 'Study Time';
    updateDisplay();
    startBtn.textContent = 'Start';
}

function switchSession() {
    isStudySession = !isStudySession;
    timeLeft = (isStudySession ? studyTimeInput.value : breakTimeInput.value) * 60;
    sessionType.textContent = isStudySession ? 'Study Time' : 'Break Time';
    updateDisplay();
    
    // Show notification
    if (Notification.permission === 'granted') {
        new Notification(isStudySession ? 'Study Time!' : 'Break Time!', {
            body: isStudySession ? 'Time to focus!' : 'Take a break!',
            icon: '/favicon.ico'
        });
    }
    
    startTimer();
}

// Task management functions
function addTask(task, reminderDateTime) {
    const li = document.createElement('li');
    const taskText = document.createElement('span');
    const reminderText = document.createElement('span');
    const deleteBtn = document.createElement('button');
    
    taskText.textContent = task;
    reminderText.textContent = new Date(reminderDateTime).toLocaleString();
    deleteBtn.textContent = '×';
    deleteBtn.className = 'btn';
    
    li.appendChild(taskText);
    li.appendChild(reminderText);
    li.appendChild(deleteBtn);
    tasksList.appendChild(li);
    
    // Set reminder
    const reminderTime = new Date(reminderDateTime).getTime();
    const now = new Date().getTime();
    const delay = reminderTime - now;
    
    if (delay > 0) {
        setTimeout(() => {
            if (Notification.permission === 'granted') {
                new Notification('Task Reminder', {
                    body: task,
                    icon: '/favicon.ico'
                });
            }
        }, delay);
    }
    
    // Delete task
    deleteBtn.addEventListener('click', () => {
        li.remove();
    });
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = taskInput.value;
    const reminder = reminderTime.value;
    
    if (task && reminder) {
        addTask(task, reminder);
        taskInput.value = '';
        reminderTime.value = '';
    }
});

// Initialize display
updateDisplay(); 