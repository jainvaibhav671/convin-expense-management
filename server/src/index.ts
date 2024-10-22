import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"

import env from "@env"
import routers from "@/routers"

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ─────────────────────────────────────────────────────
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Routers ─────────────────────────────────────────────────────────
for (const [path, router] of Object.entries(routers)) {
    app.use(path, router)
}
app.get('/', (_req, res) => { res.send('Hello, TypeScript with Express!'); });

app.listen(PORT, () => {
    console.log(`Server started at ${new Date(Date.now()).toLocaleString()}`)
    console.log(`Server is running on http://localhost:${PORT}`);
});
