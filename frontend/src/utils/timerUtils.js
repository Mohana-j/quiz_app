export const startTimer = (seconds, callback) => {
    let timeLeft = seconds;
    const timer = setInterval(() => {
      timeLeft--;
      callback(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    return timer;
  };
  