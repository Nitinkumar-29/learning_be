"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOrderToParcelXOrderPayload = void 0;
const order_enum_1 = require("../../../common/enums/order.enum");
const toStringNumber = (value) => {
    if (typeof value === "number")
        return String(value);
    if (typeof value === "string")
        return value;
    return "0";
};
const toIntegerString = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num))
        return "0";
    return String(Math.max(0, Math.round(num)));
};
const resolvePaymentMode = (paymentMethod) => {
    return paymentMethod === order_enum_1.paymentMethods.COD ? "Cod" : "Prepaid";
};
const mapOrderToParcelXOrderPayload = (order) => {
    return {
        client_order_id: order.clientOrderId || "",
        consignee_emailid: order.consignee?.email || "",
        consignee_pincode: order.consignee?.pincode || "",
        consignee_mobile: order.consignee?.mobile || "",
        consignee_phone: order.consignee?.phone || "",
        consignee_address1: order.consignee?.address1 || "",
        consignee_address2: order.consignee?.address2 || "",
        consignee_name: order.consignee?.name || "",
        invoice_number: order.invoiceNumber || "",
        express_type: order.expressType || "surface",
        pick_address_id: order.pickAddressId || "",
        return_address_id: order.returnAddressId || "",
        cod_amount: toStringNumber(order.charges?.codAmount ?? 0),
        tax_amount: toStringNumber(order.charges?.taxAmount ?? 0),
        mps: toStringNumber(order.shipment?.mps ?? 0),
        courier_type: 0,
        courier_code: "",
        products: (order.items || []).map((item) => ({
            product_sku: item.sku || "",
            product_name: item.name || "",
            product_value: toStringNumber(item.unitPrice ?? 0),
            product_hsnsac: "",
            product_taxper: item.taxPercent ?? 0,
            product_category: item.category || "",
            product_quantity: toStringNumber(item.quantity ?? 0),
            product_description: item.description || "",
        })),
        address_type: order.consignee?.addressType || "OTHER",
        payment_mode: resolvePaymentMode(order.paymentMethod),
        order_amount: toStringNumber(order.charges?.orderAmount ?? 0),
        extra_charges: toStringNumber(order.charges?.extraCharges ?? 0),
        shipment_width: (order.shipment?.width || []).map(toIntegerString),
        shipment_height: (order.shipment?.height || []).map(toIntegerString),
        shipment_length: (order.shipment?.length || []).map(toIntegerString),
        shipment_weight: (order.shipment?.weight || []).map(toIntegerString),
    };
};
exports.mapOrderToParcelXOrderPayload = mapOrderToParcelXOrderPayload;
