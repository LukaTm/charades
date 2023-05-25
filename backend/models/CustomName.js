const mongoose = require("mongoose");
// generate unique value
// const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        creator: {
            // Defines a required ObjectId reference to a User model for the creator property.
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        viewers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("CustomName", postSchema);
