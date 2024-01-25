import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]
})

usersSchema.plugin(uniqueValidator);

export default mongoose.model('User', usersSchema);