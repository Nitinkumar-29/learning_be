"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = require("./src/routes/auth.route");
const kyc_route_1 = require("./src/routes/kyc.route");
const storage_route_1 = require("./src/routes/storage.route");
const mongodb_connection_1 = require("./src/config/db/mongodb.connection");
const error_middleware_1 = require("./src/common/middleware/error.middleware");
const requestLogger_1 = require("./src/common/middleware/requestLogger");
const env_1 = require("./src/config/env");
const wallet_route_1 = require("./src/routes/wallet.route");
const order_route_1 = require("./src/routes/order.route");
const redis_config_1 = require("./src/config/redis.config");
const queues_route_1 = require("./src/routes/queues.route");
const warehouse_route_1 = require("./src/routes/warehouse.route");
const payments_route_1 = require("./src/routes/payments.route");
const integration_events_module_1 = require("./src/modules/integration-events/integration-events.module");
const app = (0, express_1.default)();
const startServer = async () => {
    await (0, mongodb_connection_1.connectToMongoDB)();
    (0, integration_events_module_1.initializeIntegrationEventListeners)();
    const redisClient = (0, redis_config_1.createRedisConnection)();
    await redisClient.ping();
    app.use(express_1.default.json());
    app.use(requestLogger_1.requestLogger);
    app.use((0, cors_1.default)({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/uploads", express_1.default.static(env_1.env.storage.uploadDir));
    app.get("/", (req, res) => {
        res.send("Hello World");
    });
    app.use("/auth", auth_route_1.authRoutes);
    app.use("/kyc", kyc_route_1.kycRoutes);
    app.use("/storage", storage_route_1.storageRoutes);
    app.use("/wallet", wallet_route_1.walletRoutes);
    app.use("/orders", order_route_1.orderRoutes);
    app.use("/warehouse", warehouse_route_1.warehouseRoutes);
    app.use("/payments", payments_route_1.paymentRoutes);
    app.use("/", queues_route_1.queuesRoutes);
    // error handling middleware should be the last middleware
    app.use(error_middleware_1.errorHandler);
    const PORT = env_1.env.app.port;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};
startServer();
