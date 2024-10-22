import userRouter from "@/routers/user"
import expenseRouter from "@/routers/expense"
import authRouter from "@/routers/auth"

export default {
    "/api/user": userRouter,
    "/api/expense": expenseRouter,
    "/api/auth": authRouter
}
