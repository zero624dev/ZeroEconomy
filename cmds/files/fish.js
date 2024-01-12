const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const fishData = new Map();

const onFishing = [
  "🎣 낚시중.",
  "🎣 낚시중..",
  "🎣 낚시중..."
];

const onCaught = [
  "🎣 낚시찌에 반응이 왔어요!",
  "🎣 낚시찌가 흔들렸어요!",
];

const onMissed = [
  "🎣 물고기를 놓쳤어요.",
  "🎣 물고기가 도망갔어요.",
  "🎣 물고기가 미끼를 물어갔어요.",
];

function editFishMessage(interaction, c) {
  const { core } = interaction.client;

  if (!fishData.has(interaction.user.id)) {
    return core.utils.reply(interaction, {
      components: []
    });
  }

  const isMissed = c > 5;
  const isCaught = c > 4 ? true : core.utils.math.randomRange(0, 9) == 0;

  let description = "";

  if (isMissed) {
    description = core.utils.math.randomArray(onMissed);
    fishData.delete(interaction.user.id);
  } else if (isCaught) {
    description = core.utils.math.randomArray(onCaught);
    c = 5;
  } else {
    description = core.utils.math.randomArray(onFishing);
  }

  core.utils.reply(interaction, {
    embeds: [
      {
        title: `${interaction.user.username}님의 낚시`,
        description: description,
        color: isCaught || isMissed ? core.colors.red : core.colors.blue
      }
    ],
    components: isMissed ? [] : [
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`${interaction.user.id}-fish-${isCaught ? 0 : "stop"}`)
            .setLabel("낚싯대 올리기")
            .setEmoji("🎣")
            .setStyle(ButtonStyle.Secondary)
        )
    ]
  }).then(() => {
    if (c <= 5) {
      setTimeout(() => {
        editFishMessage(interaction, c + 1);
      }, 2500);
    }
  });
}

module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      if (fishData.has(interaction.user.id)) {
        return core.utils.reply(interaction, {
          embeds: [
            {
              title: `${interaction.user.username}님의 낚시`,
              description: "🎣 이미 낚시중이에요.",
              color: core.colors.red
            }
          ], ephemeral: true
        });
      }

      core.utils.reply(interaction, {
        embeds: [
          {
            title: `${interaction.user.username}님의 낚시`,
            description: "💦 낚시찌를 던졌어요.",
            color: core.colors.blue
          }
        ],
        components: [
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`${interaction.user.id}-fish-stop`)
                .setLabel("낚싯대 올리기")
                .setEmoji("🎣")
                .setStyle(ButtonStyle.Secondary),
            )
        ]
      }).then(() => {
        fishData.set(interaction.user.id, 0);
        setTimeout(() => {
          editFishMessage(interaction, 1);
        }, 1000);
      });
    });
  },
  button: (interaction, args) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      const hasFishData = fishData.has(interaction.user.id);

      if (!hasFishData) {
        return core.utils.reply(interaction, {
          embeds: [
            {
              title: `${interaction.user.username}님의 낚시`,
              description: "🎣 낚시중이 아니에요.",
              color: core.colors.red
            }
          ],
          components: []
        });
      }

      if (args[0] == "stop") {
        fishData.delete(interaction.user.id);
        core.utils.reply(interaction, {
          embeds: [
            {
              title: `${interaction.user.username}님의 낚시`,
              description: "🎣 낚시를 그만두었어요.",
              color: core.colors.blue
            }
          ],
          components: []
        });
      } else {
        const click = fishData.get(interaction.user.id) + 1;
        if (click > 1) {
          fishData.delete(interaction.user.id);
          core.utils.reply(interaction, {
            embeds: [
              {
                title: `${interaction.user.username}님의 낚시`,
                description: "🎣 물고기를 낚았어요.",
                color: core.colors.blue
              }
            ],
            components: []
          });
        } else {
          fishData.set(interaction.user.id, click);
          interaction.deferUpdate();
        }
      }
    });
  }
};
