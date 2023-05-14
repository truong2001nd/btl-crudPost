const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: {
        type: String,
        required: [true, "you must be provide title"],
        //   minLength: 6,
        //   maxLength: 20,
    },

    content: {
        type: String,
        required: [true, "you must be provide content"],
        minlength: 6,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    published: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

module.exports = mongoose.model('posts', PostSchema)