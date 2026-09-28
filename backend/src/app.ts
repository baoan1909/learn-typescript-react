import express from "express";
import cors from "cors";
import indexRouter from "./routes/index.route";
import { errorHandlingMiddleware } from "./middlewares/errorHandling.middleware";

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use("/api", indexRouter);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});