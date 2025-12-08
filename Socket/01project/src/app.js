import express from "express";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("./public"))

app.get("/", (_, res) => {
    return res.status(200).json({
        success: true,
        message: "OK"
    })
})

export default app;