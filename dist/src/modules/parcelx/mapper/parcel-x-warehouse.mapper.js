"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapWarehouseParcelXPayload = void 0;
const mapWarehouseParcelXPayload = (registerWarehouse) => {
    return {
        address_title: registerWarehouse.addressTitle,
        business_name: registerWarehouse.businessName,
        full_address: registerWarehouse.fullAddress,
        phone: registerWarehouse.phone,
        pincode: registerWarehouse.pinCode,
        sender_name: registerWarehouse.senderName,
    };
};
exports.mapWarehouseParcelXPayload = mapWarehouseParcelXPayload;
