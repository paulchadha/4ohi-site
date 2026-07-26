(() => {
  "use strict";

  const countdown = document.querySelector("[data-launch-countdown]");
  if (!countdown) return;

  const target = new Date("2026-10-17T20:00:00-05:00").getTime();
  const fields = {
    days: countdown.querySelector('[data-countdown="days"]'),
    hours: countdown.querySelector('[data-countdown="hours"]'),
    minutes: countdown.querySelector('[data-countdown="minutes"]'),
    seconds: countdown.querySelector('[data-countdown="seconds"]')
  };

  const render = () => {
    const remaining = Math.max(0, target - Date.now());
    const seconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(seconds / 86400),
      hours: Math.floor((seconds % 86400) / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60
    };

    Object.entries(values).forEach(([key, value]) => {
      if (fields[key]) fields[key].textContent = String(value).padStart(2, "0");
    });

    countdown.setAttribute(
      "aria-label",
      `${values.days} days, ${values.hours} hours, ${values.minutes} minutes, and ${values.seconds} seconds until October 17, 2026`
    );

    if (remaining === 0) {
      const label = countdown.querySelector(".launch-countdown-label");
      if (label) label.textContent = "The gate is open";
    }
  };

  render();
  window.setInterval(render, 1000);
})();
