const rCho =
  ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ",
    "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const rJung =
  ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ",
    "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const rJong =
  ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ",
    "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ",
    "ㅍ", "ㅎ"];

const handleSyllables = (arr) => {
  const resultarr = [];
  const chos = [];
  for (const str of arr) {
    const tempStr = str.charCodeAt(0) - 0xAC00;
    const jong = tempStr % 28;
    const jung = (tempStr - jong) / 28 % 21;
    const cho = ((tempStr - jong) / 28 - jung) / 21;
    if (rCho[cho]) {
      resultarr.push(rCho[cho]);
      chos.push(rCho[cho]);
    }
    if (rJung[jung]) {
      resultarr.push(rJung[jung]);
    }
    if (rJong[jong]) {
      resultarr.push(rJong[jong]);
    }
  }
  resultarr.push(...chos);
  return resultarr;
};

const getStrArr = (str) => {
  const arr = [];
  const koreanArr = [];
  for (let char of str) {
    const asciiDec = char.charCodeAt(0);
    if (asciiDec >= 44032 && asciiDec <= 55215) {
      koreanArr.push(char);
    } else {
      arr.push(char);
    }
  }
  arr.push(...handleSyllables(koreanArr));
  const resultarr = [];
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i + 1]) {
      break;
    }
    resultarr.push(`${arr[i]}${arr[i + 1]}`);
  }
  return resultarr;
};

module.exports = {
  similarity: (str1, str2) => {
    str1 = getStrArr(String(str1).toLowerCase());
    str2 = getStrArr(String(str2).toLowerCase());
    let intersections = 0;

    for (const pair of str1) {
      if (str2.includes(pair)) {
        intersections++;
        str2[str2.indexOf(pair)] = "";
      }
    }
    return 2 * intersections / (str1.length + str2.length) || 0;
  },
  reverse: (str) => {
    return str.split("").reverse().join("");
  },
  isJSON: (str) => {
    try {
      if (typeof str == "object") {
        str = JSON.stringify(str);
      }
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }
};
