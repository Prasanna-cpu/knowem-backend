import express, {Express} from 'express';

import dotenv from "dotenv"
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoute";
import authRouter from "./routes/authRoute";
import {authenticateToken} from "./middleware/authMiddleware";

dotenv.config()

const app:Express = express();
const port:string|undefined = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user",authenticateToken,userRouter)
app.use("/post",authenticateToken,postRouter)
app.use("/auth",authRouter)



app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});