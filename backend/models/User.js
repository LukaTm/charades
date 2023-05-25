const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    posts: [
        {
            // Defines a required ObjectId reference to a Post model for the creator property.
            type: Schema.Types.ObjectId,
            ref: "CustomName",
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
