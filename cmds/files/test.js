const modEnums = [
  [1073741824, "MR", false, 16],
  [536870912, "V2", false, 0],
  [268435456, "2K", false, 16],
  [134217728, "3K", false, 16],
  [67108864, "1K", false, 16],
  [33554432, "CO", false, 4],
  [16777216, "9K", false, 16],
  [4194304, "CN", false, 2],
  [2097152, "RD", false, 13],
  [1048576, "FI", false, 13],
  [524288, "8K", false, 16],
  [262144, "7K", false, 16],
  [131072, "6K", false, 16],
  [65536, "5K", false, 16],
  [32768, "4K", false, 16],
  [16416, "PF", false, 7],
  [8192, "AP", false, 3],
  [4096, "SO", false, 5],
  [2048, "AT", false, 2],
  [1024, "FL", true, 6],
  [576, "NC", true, 10, 64],
  [256, "HT", true, 12],
  [128, "RX", false, 4],
  [64, "DT", true, 11],
  [32, "SD", false, 8],
  [16, "HR", true, 9],
  [8, "HD", false, 13],
  [4, "TD", true, 15],
  [2, "EZ", true, 14],
  [1, "NF", false, 1],
];

function calcEnum(eNum) {
  const modText = [];
  let rankModsEnum = 0;
  for (const mod of modEnums) {
    if (eNum >= mod[0]) {
      eNum -= mod[0];
      modText.push([mod[1], mod[3]]);
      if (mod[2]) {
        if (mod[4]) {
          rankModsEnum += mod[4];
        } else {
          rankModsEnum += mod[0];
        }
      }
    }
  }
  modText.sort((a, b) => {
    return b[1] - a[1];
  });
  return {
    modText: modText.map((m) => {
      return m[0];
    }).join(""),
    rankModsEnum: rankModsEnum
  };
}

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      core.utils.reply(interaction, "Test").then(resolve).catch(reject);
    });
  }
};
