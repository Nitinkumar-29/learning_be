"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    value: { type: Number, required: true },
    taxper: { type: Number, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
});
exports.ProductModel = (0, mongoose_1.model)("Product", ProductSchema);
