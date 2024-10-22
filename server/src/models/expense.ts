import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface IExpense extends Document {
    description: string;
    amount: number;
    splitMethod: 'equal' | 'exact' | 'percentage';
    splitDetails: number[];  // Can hold exact amounts or percentages
    participants: IUser['_id'][];
    date: Date;
}

const expenseSchema = new Schema<IExpense>({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    splitMethod: { type: String, enum: ['equal', 'exact', 'percentage'], required: true },
    splitDetails: { type: [Number], required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    date: { type: Date, default: Date.now }
}, {
    collection: "Expenses"
});

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
