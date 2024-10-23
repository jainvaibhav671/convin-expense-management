export interface Expense {
    _id: string;
    title: string;
    description: string;
    amount: number;
    splitMethod: 'equal' | 'exact' | 'percentage';
    splitDetails: number[];  // Can hold exact amounts or percentages
    userId: string;
    participants: string[];
    date: Date;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    participants: string[]
}


export type Participant = {
    name: string;
    contribution: number;
    percent?: number;
}
