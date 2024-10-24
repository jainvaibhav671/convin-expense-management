import userRouter from "./user"
import expenseRouter from "./expense"
import authRouter from "./auth"

export default {
    "/api/user": userRouter,
    "/api/expense": expenseRouter,
    "/api/auth": authRouter
}
