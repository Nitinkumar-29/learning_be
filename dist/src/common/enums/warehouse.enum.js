"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseJobTypeEnums = exports.warehouseStatusType = void 0;
var warehouseStatusType;
(function (warehouseStatusType) {
    warehouseStatusType["PENDING"] = "pending";
    warehouseStatusType["CREATED"] = "created";
    warehouseStatusType["FAILED"] = "failed";
    warehouseStatusType["INACTIVE"] = "inactive";
    warehouseStatusType["REQUEST_INITIATED"] = "request initiated";
    warehouseStatusType["REMOVAL_PENDING"] = "removal pending";
})(warehouseStatusType || (exports.warehouseStatusType = warehouseStatusType = {}));
var warehouseJobTypeEnums;
(function (warehouseJobTypeEnums) {
    warehouseJobTypeEnums["REGISTER_WAREHOUSE"] = "register warehouse";
    warehouseJobTypeEnums["REMOVE_WAREHOUSE"] = "remove warehouse";
})(warehouseJobTypeEnums || (exports.warehouseJobTypeEnums = warehouseJobTypeEnums = {}));
