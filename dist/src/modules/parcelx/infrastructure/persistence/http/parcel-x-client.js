"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelXClient = void 0;
const axios_1 = __importDefault(require("axios"));
const http_error_1 = require("../../../../../common/errors/http.error");
const env_1 = require("../../../../../config/env");
class ParcelXClient {
    constructor() {
        if (!env_1.env.parcelX.accessKey || !env_1.env.parcelX.secretKey) {
            throw new http_error_1.HttpError(500, "Missing ParcelX API credentials in environment variables");
        }
        const rawToken = `${env_1.env.parcelX.accessKey}:${env_1.env.parcelX.secretKey}`;
        const encodedToken = Buffer.from(rawToken).toString("base64");
        this.client = axios_1.default.create({
            baseURL: env_1.env.parcelX.apiUrl,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${encodedToken}`,
            },
        });
    }
    async createOrder(payload) {
        return {
            statusCode: 200,
            data: {
                success: true,
                message: "Mocked ParcelX order creation successful",
                data: payload,
            },
        };
        // return this.request({
        //   url: "/api/v3/order/create_order",
        //   method: "POST",
        //   data: payload,
        // });
    }
    async orderCancellation(payload) {
        return {
            statusCode: 200,
            data: {
                success: true,
                message: "Mocked ParcelX order creation successful",
                data: payload,
            },
        };
        // return this.request({
        //   url: "/api/v3/order/cancel_order",
        //   method: "POST",
        //   data: payload,
        // });
    }
    async createWarehouse(payload) {
        return {
            statusCode: 200,
            data: {
                success: true,
                message: "Mocked ParcelX warehouse creation successful",
                data: payload,
            },
        };
        // return this.request({
        //   url: "/api/v3/create_warehouse",
        //   method: "POST",
        //   data: payload,
        // });
    }
    async removeWarehouse(warehouseId) {
        return {
            statusCode: 200,
            data: {
                success: true,
                message: "Mocked ParcelX warehouse removal successful",
                data: warehouseId
            },
        };
    }
    async updateNdr(payload) {
        return this.request({
            url: "/api/v1/ndr/update",
            method: "POST",
            data: payload,
        });
    }
    async createB2B(payload) {
        return this.request({
            url: "/api/v1/b2b/create",
            method: "POST",
            data: payload,
        });
    }
    async request(config) {
        try {
            const response = await this.client.request(config);
            return {
                statusCode: response.status,
                data: response.data,
            };
        }
        catch (error) {
            console.log(error, "error in parcelx client");
            const err = error;
            const errorSnapshot = {
                status: err.response?.status ?? null,
                statusText: err.response?.statusText ?? null,
                data: err.response?.data ?? null,
                headers: err.response?.headers ?? null,
                request: {
                    method: config.method,
                    url: `${this.client.defaults.baseURL}${config.url}`,
                    timeout: config.timeout ?? this.client.defaults.timeout,
                },
                message: err.message,
                code: err.code ?? null,
            };
            console.error("ParcelX API error", JSON.stringify(errorSnapshot));
            throw new http_error_1.HttpError(err.response?.status || 500, JSON.stringify(errorSnapshot));
        }
    }
}
exports.ParcelXClient = ParcelXClient;
