import { GetBacon } from './utils';
import moment from 'moment';

const baconEl = document.querySelector('.bacon');

GetBacon()
  .then(res => {
    const markup = res.reduce((acc, val) => (acc += `<p>${val}</p>`), '');
    baconEl.innerHTML = markup;
  })
  .catch(err => (baconEl.innerHTML = err));

let duration = 5;
const minutesDisplay = document.getElementById('minutes');
const timeDisplay = document.getElementById('time');
const setupDiv = document.getElementById('setup');
const countdownDiv = document.getElementById('countdown');
minutesDisplay.textContent = duration;

document.getElementById('increase').addEventListener('click', () => {
  duration++;
  minutesDisplay.textContent = duration;
});

document.getElementById('decrease').addEventListener('click', () => {
  if (duration > 1) {
    duration--;
    minutesDisplay.textContent = duration;
  }
});

document.getElementById('start').addEventListener('click', () => {
  setupDiv.classList.add('hidden');
  countdownDiv.classList.remove('hidden');
  startCountdown(duration);
});

function startCountdown(minutes) {
  const endTime = moment().add(minutes, 'minutes');

  const interval = setInterval(() => {
    const now = moment();
    const diff = endTime.diff(now);

    if (diff <= 0) {
      clearInterval(interval);
      timeDisplay.textContent = '00:00';
      return;
    }

    const remaining = moment.utc(diff).format('mm:ss');
    timeDisplay.textContent = remaining;
  });
}
