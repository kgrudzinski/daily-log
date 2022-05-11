export const DateService = {
  format: function (date) {
    return formatDate(date);
  },
  toTimestamp: function (date) {
    return Math.floor(date.getTime() / 1000);
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
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const pm = month < 10 ? `0${month}` : month;
  const pd = day < 10 ? `0${day}` : day;

  return `${year}-${pm}-${pd}`;
}
