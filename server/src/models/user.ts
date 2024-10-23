import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    mobile: string;
    password: string;
    friends: {
        name: string;
        due: number
    }[]
}

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: [
        {
            name: { type: String, required: true },
            due: { type: Number, required: true }
        }
    ]
});

export const User = mongoose.model<IUser>('User', userSchema);
