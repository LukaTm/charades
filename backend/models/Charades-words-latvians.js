const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const charadesWordsLatviansSchema = new Schema({
    easy: [{ type: String }],
    medium: [{ type: String }],
    hard: [{ type: String }],
});

module.exports = mongoose.model(
    "Charades-words-latvians",
    charadesWordsLatviansSchema
);
