const mongoose = require("mongoose");

const InventorySlot = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.String, required: false },
    count: { type: mongoose.Schema.Types.Number, required: true }
  },
  {
    _id: false,
    timestamps: false
  }
);

const UserSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.String, required: true },
    wallet: { type: mongoose.Schema.Types.Number, required: true, default: 0 },
    inventory: { type: [InventorySlot], required: true, default: [] },
    lastVote: { type: mongoose.Schema.Types.Number, required: false },
  },
  {
    _id: false,
    timestamps: true
  }
);

mongoose.model("User", UserSchema);


const BotSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.String, required: true },
    wallet: { type: mongoose.Schema.Types.Number, required: true, default: 0 }
  },
  {
    _id: false,
    timestamps: true
  }
);

mongoose.model("Bot", BotSchema);

const UserCompSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.String, required: true },
    timestamps: { type: mongoose.Schema.Types.Number, required: true },
  },
  {
    _id: false,
    timestamps: false
  }
);

const CompSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.String, required: true },
    order: { type: [UserCompSchema], required: true },
  },
  {
    _id: false,
    timestamps: false
  }
);

mongoose.model("Comp", CompSchema);

const FarmSlot = new mongoose.Schema(
  {
    crop: { type: mongoose.Schema.Types.String, required: false },
    plantedAt: { type: mongoose.Schema.Types.Number, required: true }
  },
  {
    _id: false,
    timestamps: false
  }
);

const FarmSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.String, required: true },
    slots: { type: [FarmSlot], required: true, default: [] },
  },
  {
    _id: false,
    timestamps: true
  }
);

mongoose.model("Farm", FarmSchema);
