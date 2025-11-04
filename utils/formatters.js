// Utility formatters and helpers to avoid duplication across routes

function maskPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  let s = num.toFixed(2).replace('.', ',');
  return s;
}

function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

function maskDateDDMMYYYY(dateLike) {
  // Accepts Date or string 'd-m-yyyy' and returns 'dd/mm/yyyy'
  if (dateLike instanceof Date) {
    const d = dateLike.getDate();
    const m = dateLike.getMonth() + 1;
    const y = dateLike.getFullYear();
    return `${pad2(d)}/${pad2(m)}/${y}`;
  }
  if (typeof dateLike === 'string') {
    const parts = dateLike.split('-');
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return `${pad2(Number(d))}/${pad2(Number(m))}/${y}`;
    }
  }
  return String(dateLike);
}

function adjustTimezone(date, offsetMinutes = 180) {
  const d = date instanceof Date ? date : new Date(date);
  return new Date(d.valueOf() - offsetMinutes * 60000);
}

module.exports = {
  maskPrice,
  maskDateDDMMYYYY,
  adjustTimezone,
};
