
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const input = document.querySelector("#datetime-picker");
const startBtn = document.querySelector(["[data-start]"]);

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");


let userSelectedDate = null;
let timerId = null;
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
   const pickedDate = selectedDates[0];

   if (!pickedDate) {
    startBtn.disabled = true;
    return;
   }

   if (pickedDate.getTime() <= Date.now()) {
    window.alert("Please choose a date in the future");
    startBtn.disabled = true;
    return;
   }

   userSelectedDate = pickedDate;
   startBtn.disabled = false;
  }
};

flatpickr(input, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function pad(value) {
    return String(value).padStart(2, "0");
  }

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

function clearTimer() {
if (timerId) {
    clearInterval(timerId);
    timerId = null;
}
};

function updateTimer({ days, hours, minutes, seconds}) {
daysEl.textContent = days;
hoursEl.textContent = hours;
minutesEl.textContent = minutes;
secondsEl.textContent = seconds;
}

startBtn.addEventListener("click", () => {
    if (!userSelectedDate) return;

    startBtn.disabled = true;
    input.disabled = true;

    clearTimer();

    timerId = setInterval(() => {
      const now = Date.now();
      const deltaTime = userSelectedDate - now;

      if (deltaTime <= 0) {
        clearTimer();
        updateTimer({ days: "00", hours: "00", minutes: "00", seconds: "00"});
        input.disabled = false;
        return;
      }
       const timeLeft = convertMs(deltaTime);
       updateTimer(timeLeft);

    }, 1000);
    
});

