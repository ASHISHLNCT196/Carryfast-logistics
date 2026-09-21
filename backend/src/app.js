const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const anprRoutes = require("./routes/anprRoutes");
const entryRoutes = require("./routes/entryRoutes");
const exitRoutes = require("./routes/exitRoutes");
const loadingRoutes = require("./routes/loadingRoutes");
const depotRoutes = require("./routes/depotRoutes");
const dockRoutes = require("./routes/dockRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "ok", service: "carryfast-backend" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/anpr", anprRoutes);
app.use("/api/v1/entry", entryRoutes);
app.use("/api/v1/exit", exitRoutes);
app.use("/api/v1/loading", loadingRoutes);
app.use("/api/v1/depots", depotRoutes);
app.use("/api/v1/docks", dockRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/reports", reportRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

module.exports = app;
