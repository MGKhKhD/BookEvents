const mongoos = require("mongoose");

const bookingSchema = new mongoos.Schema(
  {
    event: {
      type: mongoos.Schema.Types.ObjectId,
      required: true,
      ref: "Event"
    },
    user: {
      type: mongoos.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoos.model("Booking", bookingSchema);
