import { Schema, model } from 'mongoose';

const AddressSchema = new Schema({
    address: {
        type: String,
        required: true,
        lowercase: true
    },
    user_id : {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

export default model('Address', AddressSchema);