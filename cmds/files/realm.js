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

const handleSyllables = (str) => {
  const tempStr = str.charCodeAt(0) - 0xAC00;
  const jong = tempStr % 28; // 종성
  const jung = (tempStr - jong) / 28 % 21; // 중성
  const cho = ((tempStr - jong) / 28 - jung) / 21; // 종성
  return [
    rCho[cho] || "empt",
    rJung[jung] || "empt",
    rJong[jong] || "empt"
  ];
};

const handleSyllablesFixed = (arr) => {
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

const strSeparator = (str) => {
  const arr = [];
  for (let char of str) {
    const asciiDec = char.charCodeAt(0);
    if (asciiDec >= 44032 && asciiDec <= 55215) {
      arr.push(...handleSyllables(char));
    } else {
      arr.push(char);
    }
  }
  return arr;
};

const getStrArr = (str) => {
  let arr = strSeparator(str);
  let resultarr = [];
  let index = -1, length = arr.length;
  while (++index < length) {
    resultarr.push(String(arr[index]) + arr[index + 1]);
  }
  return resultarr;
};

const getStrArrFixed = (str) => {
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
  arr.push(...handleSyllablesFixed(koreanArr));
  let resultarr = [];
  let index = -1, length = arr.length;
  while (++index < length) {
    if (!arr[index + 1]) {
      break;
    }
    resultarr.push(String(arr[index]) + arr[index + 1]);
  }
  return resultarr;
};

const similarity1 = (str1, str2) => {
  str1 = getStrArr(String(str1).toLowerCase());
  str2 = getStrArr(String(str2).toLowerCase());
  let index = -1;
  let intersections = 0;
  let rightPair;
  let leftPair;
  let offset;

  while (++index < str1.length) {
    leftPair = str1[index];
    offset = -1;

    while (++offset < str2.length) {
      rightPair = str2[offset];

      if (leftPair === rightPair) {
        intersections++;
        str2[offset] = "";
        break;
      }
    }
  }
  return `${str1}\n${str2}\n\n${2 * intersections / (str1.length + str2.length) || 0}`;
};

const similarity2 = (str1, str2) => {
  str1 = getStrArrFixed(String(str1).toLowerCase());
  str2 = getStrArrFixed(String(str2).toLowerCase());
  let intersections = 0;

  for (const pair of str1) {
    if (str2.includes(pair)) {
      intersections++;
      str2[str2.indexOf(pair)] = "";
    }
  }

  return `${str1}\n${str2}\n\n${2 * intersections / (str1.length + str2.length) || 0}`;
};

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      const str1 = interaction.options.getString("str1");
      const str2 = interaction.options.getString("str2");

      core.utils.reply(interaction, {
        embeds: [{
          title: "Original - Fix Compare",
          description: `**str1**: ${str1}\n**str2**: ${str2}`,
          fields: [{
            name: "Original",
            value: similarity1(str1, str2).toString()
          },
          {
            name: "Fix",
            value: similarity2(str1, str2).toString()
          }
          ]
        }]
      });
    });
  }
};
