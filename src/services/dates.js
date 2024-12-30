export const DateService = {
  format: function (date) {
    return formatDate(date);
  },
  toTimestamp: function (date) {
    const d = date || this.getCurrentDate();
    return Math.floor(d.getTime() / 1000);
  },
  fromTimestamp: function (ts) {
    return new Date(ts * 1000);
  },
  formatTimestamp: function (ts) {
    const date = this.fromTimestamp(ts);
    return formatDate(date);
  },
  fromString: function (date_str) {
    const parts = date_str.split("-");
    const date = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
    return this.toTimestamp(date);
  },
  formatTime: function (minutes) {
    let mins = minutes % 60;
    let hours = (minutes - mins) / 60;

    return {
      m: mins < 10 ? `0${mins}` : `${mins}`,
      h: hours < 10 ? `0${hours}` : `${hours}`,
    };
  },

  addDays: function (date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  },

  addMonths: function (date, months) {
    return new Date(
      date.getFullYear(),
      date.getMonth() + months,
      date.getDate()
    );
  },

  getCurrentDate: function () {
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  },

  getWeekNumber: function (d) {
    // Copy date so don't modify original
    let tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
  },

  getWeekStart: function (d) {
    const weekDay = d.getDay(); //0-6 => sunday = 0, saturday = 6
    //sunday
    if (weekDay === 0) {
      return this.addDays(d, -6);
    } else {
      return this.addDays(d, -(weekDay - 1));
    }
  },

  generateDays: function (start, count) {
    return Array.from(dayGenerator(start, count));
  },

  lastDayOfMonth: function (d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  },

  firstdayOfMonth: function (d) {
    let month_start = d ? new Date(d) : this.getCurrentDate();
    month_start.setDate(1);
    return month_start;
  },

  formatDateTime: (date) => {
    return formatDateTime(date);
  },
};

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minutes = date.getMinutes();

  const pm = `${month}`.padStart(2, "0");
  const pd = `${day}`.padStart(2, "0");
  const ph = `${hour}`.padStart(2, "0");
  const pmt = `${minutes}`.padStart(2, "0");

  return `${year}${pm}${pd}_${ph}${pmt}`;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const pm = month < 10 ? `0${month}` : month;
  const pd = day < 10 ? `0${day}` : day;

  return `${year}-${pm}-${pd}`;
}

function* dayGenerator(start, count) {
  for (let i = 0; i < count; ++i) {
    yield DateService.addDays(start, i);
  }
}
