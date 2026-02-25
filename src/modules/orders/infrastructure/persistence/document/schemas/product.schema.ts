import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    value: { type: Number, required: true },
    taxper: { type: Number, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
})

export const ProductModel = model("Product", ProductSchema);