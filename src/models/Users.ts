import { Schema, model } from 'mongoose';

const UsersSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        lowercase: true
    },
    department: {
        type: String,
        required: true,
        lowercase: true
    },
    position: {
        type: String,
        required: true,
        lowercase: true
    }
});

export default model('Users', UsersSchema);