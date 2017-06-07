import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: mongoose.Types.ObjectId
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    salt: String,
    hash: String,
    role: String
});

userSchema.set('toJSON', {getters: true});

export default mongoose.model('User', userSchema);