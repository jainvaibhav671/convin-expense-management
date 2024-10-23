import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface IExpense extends Document {
    title: string;
    description: string;
    amount: number;
    splitMethod: 'equal' | 'exact' | 'percentage';
    splitDetails: number[];  // Can hold exact amounts or percentages
    userId: IUser['_id'];
    participants: string[];
    date: Date;
}

const expenseSchema = new Schema<IExpense>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    splitMethod: { type: String, enum: ['equal', 'exact', 'percentage'], required: true },
    splitDetails: { type: [Number], required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: { type: [String], required: true },
    date: { type: Date, default: Date.now }
}, {
    collection: "Expenses"
});

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
