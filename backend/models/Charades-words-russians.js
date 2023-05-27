const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const charadesWordsRussiansSchema = new Schema({
    easy: [{ type: String }],
    medium: [{ type: String }],
    hard: [{ type: String }],
});

module.exports = mongoose.model(
    "Charades-words-russians",
    charadesWordsRussiansSchema
);
