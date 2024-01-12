const importFresh = require("import-fresh");
const { SlashCommandBuilder } = require("discord.js");

const devs = ["285229678443102218", "532239959281893397", "643042406455050254"];

module.exports = {
  beg: {
    cooldown: 1000 * 60 * 5,
    data: new SlashCommandBuilder()
      .setName("beg")
      .setNameLocalization("ko", "구걸")
      .setDescription("Beg for money")
      .setDescriptionLocalization("ko", "돈 구걸하기"),
    execute: importFresh("./files/beg.js"),
  },
  blackjack: {
    cooldown: 1000 * 10,
    data: new SlashCommandBuilder()
      .setName("blackjack")
      .setNameLocalization("ko", "블랙잭")
      .setDescription("Reward: 1.9x")
      .setDescriptionLocalization("ko", "배율: 1.9x")
      .addIntegerOption((option) => {
        return option.setName("bet")
          .setNameLocalization("ko", "베팅액")
          .setDescription("Reward: 1.9x")
          .setDescriptionLocalization("ko", "배율: 1.9x")
          .setMinValue(1000)
          .setMaxValue(100000)
          .setRequired(true);
      }),
    execute: importFresh("./files/blackjack.js"),
  },
  bot: {
    data: new SlashCommandBuilder()
      .setName("bot")
      .setNameLocalization("ko", "봇")
      .setDescription("Shows information about the bot")
      .setDescriptionLocalization("ko", "봇에 대한 정보를 보여줘요."),
    execute: importFresh("./files/bot.js"),
  },
  comp: {
    data: new SlashCommandBuilder()
      .setName("comp")
      .setNameLocalization("ko", "출석")
      .setDescription("Takes the reward for comp.")
      .setDescriptionLocalization("ko", "출석 보상을 받아요."),
    execute: importFresh("./files/comp.js"),
  },
  currency: {
    guilds: ["1176759489366589550"],
    whitelist: devs,
    data: new SlashCommandBuilder()
      .setName("currency")
      .setDescription("Manage currency")
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("set")
          .setDescription("Set a user's currency")
          .addUserOption((option) => {
            return option
              .setName("member")
              .setDescription("The member to set the currency of.")
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option
              .setName("value")
              .setDescription("The value to set the currency to.")
              .setRequired(true);
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("give")
          .setDescription("Give a user currency")
          .addUserOption((option) => {
            return option
              .setName("member")
              .setDescription("The member to give the currency to.")
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option
              .setName("value")
              .setDescription("The value to give the currency.")
              .setRequired(true);
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("collect")
          .setDescription("Collect a user's currency")
          .addUserOption((option) => {
            return option
              .setName("member")
              .setDescription("The member to collect the currency of.")
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option
              .setName("value")
              .setDescription("The value to collect the currency.")
              .setRequired(true);
          });
      }),
    execute: importFresh("./files/currency.js"),
  },
  eval: {
    guilds: ["1176759489366589550"],
    whitelist: devs,
    data: new SlashCommandBuilder()
      .setName("eval")
      .setDescription("Run some code")
      .addStringOption((option) => {
        return option
          .setName("code")
          .setDescription("Code to run")
          .setRequired(true);
      }),
    execute: importFresh("./files/eval.js"),
  },
  evenodd: {
    cooldown: 1000 * 5,
    data: new SlashCommandBuilder()
      .setName("evenodd")
      .setNameLocalization("ko", "홀짝")
      .setDescription("Reward: 1.9x")
      .setDescriptionLocalization("ko", "배율: 1.9x")
      .addIntegerOption((option) => {
        return option
          .setName("bet")
          .setNameLocalization("ko", "베팅액")
          .setDescription("Reward: 1.9x")
          .setDescriptionLocalization("ko", "배율: 1.9x")
          .setMinValue(1000)
          .setMaxValue(100000)
          .setRequired(true);
      })
      .addIntegerOption((option) => {
        return option
          .setName("guess")
          .setNameLocalization("ko", "선택")
          .setDescription("Reward: 1.9x")
          .setDescriptionLocalization("ko", "배율: 1.9x")
          .addChoices(
            {
              name: "odd",
              name_localizations: {
                ko: "홀",
              },
              value: 1,
            },
            {
              name: "even",
              name_localizations: {
                ko: "짝",
              },
              value: 0,
            }
          )
          .setRequired(true);
      }),
    execute: importFresh("./files/evenodd.js"),
  },
  farm: {
    data: new SlashCommandBuilder()
      .setName("farm")
      .setNameLocalization("ko", "농사")
      .setDescription("Farm related commands")
      .setDescriptionLocalization("ko", "농사 관련 명령어")
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("status")
          .setNameLocalization("ko", "상태")
          .setDescription("Shows the current status of a farm")
          .setDescriptionLocalization("ko", "현재 농장의 상태를 보여줘요.")
          .addUserOption((option) => {
            return option
              .setName("member")
              .setNameLocalization("ko", "멤버")
              .setDescription("The member to show the farm of.")
              .setDescriptionLocalization("ko", "농장을 확인할 멤버");
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("plant")
          .setNameLocalization("ko", "심기")
          .setDescription("Plant a seed in the farm.")
          .setDescriptionLocalization("ko", "농장에 씨앗을 심어요.")
          .addStringOption((option) => {
            return option
              .setName("crop")
              .setNameLocalization("ko", "작물")
              .setDescription("The crop to plant.")
              .setDescriptionLocalization("ko", "심을 작물")
              .setAutocomplete(true)
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option
              .setName("amount")
              .setNameLocalization("ko", "수량")
              .setDescription("The amount of seeds to plant.")
              .setDescriptionLocalization("ko", "심을 씨앗의 수량")
              .setMinValue(1)
              .setRequired(true);
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("harvest")
          .setNameLocalization("ko", "수확")
          .setDescription("Harvest the fully grown crops in your farm.")
          .setDescriptionLocalization("ko", "농장에 다 자란 작물을 수확해요.");
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("expand")
          .setNameLocalization("ko", "확장")
          .setDescription("Expand your farm. (100,000 Won)")
          .setDescriptionLocalization("ko", "농장을 확장해요. (100,000 원)")
          .addIntegerOption((option) => {
            return option
              .setName("amount")
              .setNameLocalization("ko", "칸수")
              .setDescription("The amount of land to expand.")
              .setDescriptionLocalization("ko", "확장할 땅 칸수")
              .setMinValue(1);
          });
      }),
    execute: importFresh("./files/farm.js"),
  },
  fish: {
    cooldown: 1000 * 10,
    data: new SlashCommandBuilder()
      .setName("fish")
      .setNameLocalization("ko", "낚시")
      .setDescription("Starts fishing")
      .setDescriptionLocalization("ko", "낚시를 시작해요"),
    execute: importFresh("./files/fish.js"),
  },
  heart: {
    data: new SlashCommandBuilder()
      .setName("heart")
      .setNameLocalization("ko", "하트")
      .setDescription("Vote for the bot and get a reward.")
      .setDescriptionLocalization("ko", "한디리에서 봇을 추천하고 보상을 받아요."),
    execute: importFresh("./files/heart.js"),
  },
  indian_poker: {
    cooldown: 1000 * 5,
    data: new SlashCommandBuilder()
      .setName("indian_poker")
      .setNameLocalization("ko", "인디언포커")
      .setDescription("Reward: 1.8x")
      .setDescriptionLocalization("ko", "배율: 1.8x")
      .addIntegerOption((option) => {
        return option
          .setName("bet")
          .setNameLocalization("ko", "베팅액")
          .setDescription("Reward: 1.8x")
          .setDescriptionLocalization("ko", "배율: 1.8x")
          .setMinValue(1000)
          .setMaxValue(100000)
          .setRequired(true);
      }),
    execute: importFresh("./files/indianPoker.js"),
  },
  inventory: {
    data: new SlashCommandBuilder()
      .setName("inventory")
      .setNameLocalization("ko", "인벤토리")
      .setDescription("Show a user's inventory")
      .setDescriptionLocalization("ko", "현재 인벤토리를 보여줘요.")
      .addUserOption((option) => {
        return option
          .setName("member")
          .setDescription("The member to show the inventory of.")
          .setNameLocalization("ko", "멤버")
          .setDescriptionLocalization("ko", "인벤토리를 확인할 멤버");
      }),
    execute: importFresh("./files/inventory.js"),
  },
  item: {
    guilds: ["1176759489366589550"],
    whitelist: devs,
    data: new SlashCommandBuilder()
      .setName("item")
      .setDescription("Manage inventory")
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("clear")
          .setDescription("Clear a user's inventory")
          .addUserOption((option) => {
            return option
              .setName("member")
              .setDescription("The member to clear the inventory of.")
              .setRequired(true);
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("set")
          .setDescription("Set a user's inventory")
          .addUserOption((option) => {
            return option
              .setName("member")
              .setDescription("The member to set the inventory of.")
              .setRequired(true);
          })
          .addStringOption((option) => {
            return option
              .setName("item")
              .setDescription("The item to set.")
              .setAutocomplete(true)
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option
              .setName("amount")
              .setDescription("The amount to set the item to.")
              .setRequired(true);
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("give")
          .setDescription("Give items to a user")
          .addUserOption((option) => {
            return option
              .setName("member")
              .setDescription("The member to give the item to.")
              .setRequired(true);
          })
          .addStringOption((option) => {
            return option
              .setName("item")
              .setDescription("The item to give.")
              .setAutocomplete(true)
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option
              .setName("amount")
              .setDescription("The amount to give the item.")
              .setRequired(true);
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("collect")
          .setDescription("Collect items from a user")
          .addUserOption((option) => {
            return option
              .setName("member")
              .setDescription("The member to collect the item from.")
              .setRequired(true);
          })
          .addStringOption((option) => {
            return option
              .setName("item")
              .setDescription("The item to collect.")
              .setAutocomplete(true)
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option
              .setName("amount")
              .setDescription("The amount to collect the item.")
              .setRequired(true);
          });
      }),
    execute: importFresh("./files/item.js"),
  },
  rank: {
    data: new SlashCommandBuilder()
      .setName("rank")
      .setNameLocalization("ko", "순위")
      .setDescription("Show currency rankings")
      .setDescriptionLocalization("ko", "화폐 보유 순위를 보여줘요.")
      .addStringOption((option) => {
        return option
          .setName("type")
          .setNameLocalization("ko", "종류")
          .setDescription("Select the type of rank to show.")
          .setDescriptionLocalization("ko", "보여줄 순위의 종류를 선택해요.")
          .addChoices(
            {
              name: "wallet",
              name_localizations: {
                ko: "지갑",
              },
              value: "wallet",
            },
            {
              name: "comp",
              name_localizations: {
                ko: "출석",
              },
              value: "comp",
            }
          )
          .setRequired(true);
      }),
    execute: importFresh("./files/rank.js"),
  },
  realm: {
    guilds: ["1176759489366589550"],
    whitelist: devs,
    data: new SlashCommandBuilder()
      .setName("realm")
      .setDescription("realm")
      .addStringOption((option) => {
        return option.setName("str1")
          .setDescription("str1")
          .setRequired(true);
      })
      .addStringOption((option) => {
        return option.setName("str2")
          .setDescription("str2")
          .setRequired(true);
      }),
    execute: importFresh("./files/realm.js"),
  },
  reload: {
    guilds: ["1176759489366589550"],
    whitelist: ["285229678443102218", "532239959281893397"],
    data: new SlashCommandBuilder()
      .setName("reload")
      .setDescription("reload core"),
    execute: importFresh("./files/reload.js"),
  },
  restart: {
    guilds: ["1176759489366589550"],
    whitelist: ["285229678443102218", "532239959281893397"],
    data: new SlashCommandBuilder()
      .setName("restart")
      .setDescription("restart the bot"),
    execute: importFresh("./files/restart.js"),
  },
  shop: {
    data: new SlashCommandBuilder()
      .setName("shop")
      .setNameLocalization("ko", "상점")
      .setDescription("Shop related commands")
      .setDescriptionLocalization("ko", "상점 관련 명령어")
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("buy")
          .setNameLocalization("ko", "구매")
          .setDescription("Buy item from the shop.")
          .setDescriptionLocalization("ko", "상점에서 아이템을 구매합니다.")
          .addStringOption((option) => {
            return option
              .setName("item")
              .setNameLocalization("ko", "아이템")
              .setDescription("Select the item to buy.")
              .setDescriptionLocalization("ko", "구매할 아이템을 선택합니다.")
              .setAutocomplete(true)
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option
              .setName("amount")
              .setNameLocalization("ko", "개수")
              .setDescription("Amount of item to buy")
              .setDescriptionLocalization("ko", "구매할 아이템의 개수")
              .setRequired(true)
              .setMinValue(1);
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("sell")
          .setNameLocalization("ko", "판매")
          .setDescription("Sell item to the shop.")
          .setDescriptionLocalization("ko", "상점에서 아이템을 판매합니다.")
          .addStringOption((option) => {
            return option
              .setName("item")
              .setNameLocalization("ko", "아이템")
              .setDescription("Select the item to sell.")
              .setDescriptionLocalization("ko", "판매할 아이템을 선택합니다.")
              .setAutocomplete(true)
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option
              .setName("amount")
              .setNameLocalization("ko", "개수")
              .setDescription("Amount of item to sell")
              .setDescriptionLocalization("ko", "판매할 아이템의 개수")
              .setRequired(true)
              .setMinValue(1);
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("items")
          .setNameLocalization("ko", "항목")
          .setDescription("Shows the items in the shop.")
          .setDescriptionLocalization("ko", "상점에 있는 아이템을 보여줍니다.");
      }),
    execute: importFresh("./files/shop.js"),
  },
  sironemo: {
    guilds: ["1176759489366589550"],
    whitelist: devs,
    data: new SlashCommandBuilder()
      .setName("sironemo")
      .setDescription("sironemo"),
    execute: importFresh("./files/sironemo.js"),
  },
  slots: {
    cooldown: 1000 * 5,
    data: new SlashCommandBuilder()
      .setName("slots")
      .setNameLocalization("ko", "슬롯")
      .setDescription("Rewards: Jackpot = 100x, 2 of a kind = 5x")
      .setDescriptionLocalization("ko", "배율: 잭팟 = 100x, 2개 일치 = 5x")
      .addIntegerOption((option) => {
        return option
          .setName("bet")
          .setNameLocalization("ko", "베팅액")
          .setDescription("Rewards: Jackpot = 100x, 2 of a kind = 5x")
          .setDescriptionLocalization("ko", "배율: 잭팟 = 100x, 2개 일치 = 5x")
          .setMinValue(1000)
          .setMaxValue(100000)
          .setRequired(true);
      }),
    execute: importFresh("./files/slots.js"),
  },
  upload: {
    guilds: ["1176759489366589550"],
    whitelist: devs,
    data: new SlashCommandBuilder()
      .setName("upload")
      .setDescription("upload commands"),
    execute: importFresh("./files/upload.js"),
  },
  wallet: {
    data: new SlashCommandBuilder()
      .setName("wallet")
      .setNameLocalization("ko", "지갑")
      .setDescription("Show a user's wallet")
      .setDescriptionLocalization("ko", "현재 지갑을 보여줘요.")
      .addUserOption((option) => {
        return option
          .setName("member")
          .setDescription("The member to show the wallet of.")
          .setNameLocalization("ko", "멤버")
          .setDescriptionLocalization("ko", "지갑을 확인할 멤버");
      }),
    execute: importFresh("./files/wallet.js"),
  },
  zero: {
    guilds: ["1176759489366589550"],
    whitelist: devs,
    data: new SlashCommandBuilder().setName("zero").setDescription("zero")
      .addStringOption((option) => {
        return option
          .setName("a")
          .setDescription("a")
          .setRequired(true);
      })
      .addStringOption((option) => {
        return option
          .setName("b")
          .setDescription("b")
          .setRequired(true);
      }),
    execute: importFresh("./files/zero.js"),
  },
  /* lotto: {
    data: new SlashCommandBuilder()
      .setName("lotto")
      .setNameLocalization("ko", "로또")
      .setDescription("You can buy lotto.")
      .setDescriptionLocalization("ko", "로또를 구매할 수 있어요.")
      .addIntegerOption((option) => {
        return option.setName("amount")
          .setNameLocalization("ko", "구매개수")
          .setDescription("Max 30, 1 lotto 1,000 won")
          .setDescriptionLocalization("ko", "최대 30장 구매 가능, 1장 당 1,000 원")
          .setMinValue(0)
          .setMaxValue(30)
          .setRequired(true);
      }),
    execute: importFresh("./files/lotto.js")
  },
  instantlotto: {
    data: new SlashCommandBuilder()
      .setName("instantlotto")
      .setNameLocalization("ko", "즉석복권")
      .setDescription("You can buy instant lotto.")
      .setDescriptionLocalization("ko", "즉석복권을 구매할 수 있어요."),
    execute: importFresh("./files/instantLotto.js")
  }*/
};
