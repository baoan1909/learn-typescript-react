import express from "express";
import cors from "cors";
import indexRouter from "./routes/index.route";
const app = express();
const PORT = 3000;
app.use(cors());
app.use("/api", indexRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});