const mongoose = require("mongoose");

const publishSchema = new mongoose.Schema({
    college: {
        type: String
    },
    course: {
        type: String
    },
    semester: {
        type: String
    },
    subject: {
        type: String
    },
    youtubelink:{
        type: String
    },
    bookslink:{
        type: String
    }
});

const publish = mongoose.model("publish",publishSchema);

module.exports=publish;