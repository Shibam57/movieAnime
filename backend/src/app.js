const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const app = express();
const path = require("path")


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "100mb"}))
app.use(express.urlencoded({extended: true, limit: '100mb'}))
app.use(express.static('public'))
app.use(cookieParser())


const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const movieRouter = require("./routes/movie.route");
const paymentRouter = require("./routes/payment.route");
const seriesRouter = require("./routes/series.route");
const seasonRouter = require("./routes/season.route");
const episodeRouter = require("./routes/episode.route");
const contentRouter = require("./routes/content.route");
const dashboardRouter = require("./routes/dashboard.route");
const errorHandler = require('./middlewares/errorHandler');
const notificationRoutes = require("./routes/notification.routes");

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/series", seriesRouter);
app.use("/api/v1/season", seasonRouter);
app.use("/api/v1/episode", episodeRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/notifications", notificationRoutes);

app.use(errorHandler);

module.exports = app;