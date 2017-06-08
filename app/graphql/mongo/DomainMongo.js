import mongoose from "mongoose";

let domainSchema = new mongoose.Schema({
    names: {
        type: [String],
        required: true,
        unique: true,
    },
    quantity: {
        type: Number,
        required: true
    }
});

domainSchema.set('toJSON', {getters: true});



export default mongoose.model('Domain', domainSchema, 'domains');