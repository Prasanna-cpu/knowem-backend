import express, {Express} from 'express';

import dotenv from "dotenv"
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoute";

dotenv.config()

const app:Express = express();
const port:string|undefined = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user",userRouter)
app.use("/post",postRouter)



app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});