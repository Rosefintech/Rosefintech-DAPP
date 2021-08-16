

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getLocalStorage(key, noObject = {}) {
  const lc = localStorage.getItem(key)
  return lc ? JSON.parse(lc) : noObject
}

export function handleForum() {
  window.open('https:
}


export function debounce(func, delay = 350) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, arguments)
    }, delay)
  }
}


export function throttle(func, wait = 350) {
  let start = 0
  return function () {
    let now = Date.now()
    if (now - start >= wait) {
      func.apply(this, arguments)
      start = now
    }
  }
}

export function formatDate(time = Date.now()) {
  const date = new Date(time);
  const padS = (n) => (n < 10 ? `0${n}` : n);
  return `${date.getFullYear()}-${padS(date.getMonth() + 1)}-${padS(date.getDate())}`;
}

/**
 *
 * @param {*} pointA1
 * @param {*} pointB2
 */
export function getDistance(pointA, pointB) {
  return Math.sqrt(
    Math.pow(pointA.clientX - pointB.clientX, 2) + Math.pow(pointA.clientY - pointB.clientY, 2)
  )
}

/**
 *,
 * @param {Number} size
 * @param {Number} [pointLength=2]。
 * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]]。。
 *   K(M,K.
 */
export function formatSize(size, pointLength, units) {
  let unit;
  units = units || [ 'B', 'K', 'M', 'G', 'TB' ];
  while ((unit = units.shift()) && size > 1024) {
    size = size / 1024;
  }
  return (unit === 'B' ? size : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit;
}

/**
 *
 * @param num int
 * @param precision int
 */
export function shortenNumber(num, precision = 2){
  let out = 0;
  if (num < 1e+3) {
    out = +toFixedFloor(num, precision);
  } else if (num < 1e+6) {
    out = +toFixedFloor(num / 1e+3, precision) + 'k';
  } else if (num < 1e+9) {
    out = +toFixedFloor(num / 1e+6, precision) + 'm';
  } else if (num < 1e+12) {
    out = +toFixedFloor(num / 1e+9, precision) + 'b';
  }

  return out;
}

/**
 *
 */
export function randomHexColor() {
  return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
}

/**
 *
 * @param {String} address
 */
export function verifyWalletAddress(address) {
  return /[0-9A-z]{42}/i.test(address)
}

/**
 *
 * @param {String} email
 */
export function verifyEmail(email) {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i.test(email)
}

/**
 *
 * @param {*} num
 * @param {*} len
 */
export function toFixedFloor(num, len = 2) {
  const n = (+num).toFixed(len + 1)
  return n.slice(0, n.length - 1)
}

export function toFixedFloorPercent(num) {
  if (num == 0) {
    return '/'
  }
  return toFixedFloor(num, 2) + '%'
}

/*
 ，
 ：javascript。
 ：arg1：）
 ：utils.Add(arg1,arg2,d)
 ：
  */
export function Add(arg1, arg2) {
  arg1 = arg1.toString(), arg2 = arg2.toString();
  let arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "", d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
  let maxLen = Math.max(d1.length, d2.length);
  let m = Math.pow(10, maxLen);
  let result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
  let d = arguments[2];
  return typeof d === "number" ? Number((result).toFixed(d)) : result;
}

/*
 ：
 ：。
 ：arg1：
 ：utils.Sub(arg1,arg2)
 ：
  */
export function Sub(arg1, arg2) {
  return this.Add(arg1, -Number(arg2), arguments[2]);
}

  /*
 ：
 ：。
 ：arg1：)
 ：utils.Mul(arg1,arg2)
 ：
  */
export function Mul(arg1, arg2) {
  let r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
  m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
  resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
  return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
}

/*

。
)
：utils.Div(arg1,arg2)

*/
export function Div(arg1, arg2) {
  let r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
  m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
  resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
  return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
}
