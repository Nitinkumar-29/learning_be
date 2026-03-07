"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountTypes = exports.isGstOptions = exports.entityTypes = void 0;
var entityTypes;
(function (entityTypes) {
    entityTypes["INDIVIDUAL"] = "individual";
    entityTypes["SELF_EMPLOYMENT"] = "self_employment";
    entityTypes["PROPRIETORSHIP"] = "proprietorship firm";
    entityTypes["LIMITED_LIABILITY_PARTNERSHIP"] = "limited liability partnership";
    entityTypes["PRIVATE_LIMITED_COMPANY"] = "private limited company";
    entityTypes["PUBLIC_LIMITED_COMPANY"] = "public limited company";
    entityTypes["PARTNERSHIP_FIRM"] = "partnership firm";
})(entityTypes || (exports.entityTypes = entityTypes = {}));
var isGstOptions;
(function (isGstOptions) {
    isGstOptions["YES"] = "yes";
    isGstOptions["NO"] = "no";
})(isGstOptions || (exports.isGstOptions = isGstOptions = {}));
var accountTypes;
(function (accountTypes) {
    accountTypes["SAVINGS"] = "savings";
    accountTypes["CURRENT"] = "current";
    accountTypes["OTHER"] = "other";
})(accountTypes || (exports.accountTypes = accountTypes = {}));
