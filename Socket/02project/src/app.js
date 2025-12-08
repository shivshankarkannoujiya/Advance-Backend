import express from 'express';

const app = express();
const appState = new Array(100).fill(false);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('./public'));

app.get('/', (_, res) => {
    return res.status(200).json({
        success: true,
        message: 'OK',
    });
});

app.get('/state', (_, res) => {
    return res.status(200).json({
        success: true,
        state: appState,
    });
});

export { app, appState };
