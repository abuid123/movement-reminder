// ==================== //
// State Management
// ==================== //

const WORK_TIME = 10; // 10 seconds for testing (normally 40 * 60)
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const exercises = [
    'Sentadillas (10–15)',
    'Estocadas o subir/bajar escalones',
    'Rotaciones de cuello y hombros',
    'Abrir el pecho (entrelazar manos atrás y estirar)',
    'Flexiones de tobillos y caderas'
];

let state = {
    mode: 'work', // 'work' or 'break'
    timeRemaining: WORK_TIME,
    isRunning: false,
    selectedExercises: []
};

let timerInterval = null;

// ==================== //
// DOM Elements
// ==================== //

const timerDisplay = document.getElementById('timerDisplay');
const breakTimerDisplay = document.getElementById('breakTimerDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const progressFill = document.getElementById('progressFill');
const breakModal = document.getElementById('breakModal');
const exerciseList = document.getElementById('exerciseList');
const finishEarlyBtn = document.getElementById('finishEarlyBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const confirmOkBtn = document.getElementById('confirmOkBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');

// ==================== //
// Confirmation Modal Functions
// ==================== //

function showConfirm (title, message) {
    return new Promise((resolve) => {
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        confirmModal.classList.add('active');

        const handleConfirm = () => {
            confirmModal.classList.remove('active');
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            confirmModal.classList.remove('active');
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            confirmOkBtn.removeEventListener('click', handleConfirm);
            confirmCancelBtn.removeEventListener('click', handleCancel);
        };

        confirmOkBtn.addEventListener('click', handleConfirm);
        confirmCancelBtn.addEventListener('click', handleCancel);
    });
}

// ==================== //
// Notification Functions
// ==================== //

function playNotificationSound () {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Pleasant notification tone
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.error('Error playing notification sound:', e);
    }
}

function showNativeNotification () {
    console.log('showNativeNotification called');
    console.log('Notification support:', 'Notification' in window);
    console.log('Notification permission:', Notification.permission);

    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return;
    }

    if (Notification.permission === 'granted') {
        try {
            console.log('Creating notification...');
            const notification = new Notification('⏰ Hora de moverte', {
                body: 'Es momento de tu pausa activa de 5 minutos',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧘</text></svg>',
                tag: 'movement-reminder',
                vibrate: [200, 100, 200]
            });

            console.log('Notification created successfully');

            notification.onclick = () => {
                console.log('Notification clicked');
                window.focus();
                notification.close();
            };

            notification.onerror = (e) => {
                console.error('Notification error:', e);
            };

            notification.onshow = () => {
                console.log('Notification shown');
            };

            notification.onclose = () => {
                console.log('Notification closed');
            };
        } catch (e) {
            console.error('Error creating notification:', e);
        }
    } else if (Notification.permission === 'denied') {
        console.warn('Notification permission denied');
    } else {
        console.log('Notification permission not yet requested');
    }
}

async function requestNotificationPermission () {
    if ('Notification' in window && Notification.permission === 'default') {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        } catch (e) {
            console.error('Error requesting notification permission:', e);
        }
    }
}

// ==================== //
// Utility Functions
// ==================== //

function formatTime (seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getRandomExercises (count = 4) {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, exercises.length));
}

function updateProgress () {
    const totalTime = state.mode === 'work' ? WORK_TIME : BREAK_TIME;
    const percentage = (state.timeRemaining / totalTime) * 100;
    progressFill.style.width = `${percentage}%`;
}

function updateDisplay () {
    if (state.mode === 'work') {
        timerDisplay.textContent = formatTime(state.timeRemaining);
        updateProgress();
    } else {
        breakTimerDisplay.textContent = formatTime(state.timeRemaining);
    }
}

// ==================== //
// LocalStorage Functions
// ==================== //

function saveState () {
    localStorage.setItem('movementReminderState', JSON.stringify({
        mode: state.mode,
        timeRemaining: state.timeRemaining,
        isRunning: state.isRunning,
        selectedExercises: state.selectedExercises,
        timestamp: Date.now()
    }));
}

function loadState () {
    const saved = localStorage.getItem('movementReminderState');
    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - parsed.timestamp) / 1000);

        state.mode = parsed.mode;
        state.selectedExercises = parsed.selectedExercises || [];

        if (parsed.isRunning) {
            // Adjust time based on elapsed time
            state.timeRemaining = Math.max(0, parsed.timeRemaining - elapsed);
            state.isRunning = true;

            // If time ran out while away
            if (state.timeRemaining === 0) {
                if (state.mode === 'work') {
                    startBreak();
                } else {
                    finishBreak();
                }
            } else {
                startTimer();
            }
        } else {
            state.timeRemaining = parsed.timeRemaining;
            state.isRunning = false;
        }

        updateDisplay();
        updateButtonStates();

        // Restore break modal if in break mode
        if (state.mode === 'break') {
            showBreakModal();
        }
    } catch (e) {
        console.error('Error loading state:', e);
    }
}

// ==================== //
// Timer Functions
// ==================== //

function startTimer () {
    if (state.isRunning) return;

    state.isRunning = true;
    updateButtonStates();

    timerInterval = setInterval(() => {
        state.timeRemaining--;
        updateDisplay();
        saveState();

        if (state.timeRemaining <= 0) {
            stopTimer();
            if (state.mode === 'work') {
                startBreak();
            } else {
                finishBreak();
            }
        }
    }, 1000);
}

function stopTimer () {
    state.isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    updateButtonStates();
    saveState();
}

function resetTimer () {
    stopTimer();
    state.mode = 'work';
    state.timeRemaining = WORK_TIME;
    state.selectedExercises = [];
    updateDisplay();
    updateButtonStates();
    saveState();
}

// ==================== //
// Break Functions
// ==================== //

function startBreak () {
    state.mode = 'break';
    state.timeRemaining = BREAK_TIME;
    state.selectedExercises = getRandomExercises();

    // Play notification sound and show native notification
    playNotificationSound();
    showNativeNotification();

    showBreakModal();
    startTimer();
    saveState();
}

function showBreakModal () {
    // Populate exercises
    exerciseList.innerHTML = '';
    state.selectedExercises.forEach((exercise, index) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `exercise${index}`;

        const label = document.createElement('label');
        label.htmlFor = `exercise${index}`;
        label.textContent = exercise;

        li.appendChild(checkbox);
        li.appendChild(label);
        exerciseList.appendChild(li);
    });

    // Reset mental checkboxes
    document.getElementById('mental1').checked = false;
    document.getElementById('mental2').checked = false;

    // Show modal
    breakModal.classList.add('active');
}

function hideBreakModal () {
    breakModal.classList.remove('active');
}

function finishBreak () {
    hideBreakModal();
    state.mode = 'work';
    state.timeRemaining = WORK_TIME;
    state.selectedExercises = [];
    updateDisplay();
    startTimer();
    saveState();
}

// ==================== //
// UI Functions
// ==================== //

function updateButtonStates () {
    if (state.mode === 'work') {
        if (state.isRunning) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        } else {
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
        }
    }
}

// ==================== //
// Event Listeners
// ==================== //

startBtn.addEventListener('click', () => {
    startTimer();
});

pauseBtn.addEventListener('click', () => {
    stopTimer();
});

resetBtn.addEventListener('click', async () => {
    const confirmed = await showConfirm(
        'Reiniciar temporizador',
        '¿Estás seguro de que quieres reiniciar el temporizador?'
    );
    if (confirmed) {
        resetTimer();
    }
});

finishEarlyBtn.addEventListener('click', async () => {
    const confirmed = await showConfirm(
        'Terminar pausa',
        '¿Ya terminaste tu pausa activa?'
    );
    if (confirmed) {
        stopTimer();
        finishBreak();
    }
});

// ==================== //
// Initialization
// ==================== //

document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission
    requestNotificationPermission();

    loadState();
    updateDisplay();
    updateButtonStates();
});

// Save state before page unload
window.addEventListener('beforeunload', () => {
    saveState();
});
