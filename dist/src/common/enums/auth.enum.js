"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessType = exports.userRole = void 0;
var userRole;
(function (userRole) {
    userRole["ADMIN"] = "admin";
    userRole["USER"] = "user";
})(userRole || (exports.userRole = userRole = {}));
var businessType;
(function (businessType) {
    businessType["FRANCHISE"] = "franchise";
    businessType["ECOMMERCE"] = "ecommerce";
    businessType["RETAILER"] = "retailer";
})(businessType || (exports.businessType = businessType = {}));
