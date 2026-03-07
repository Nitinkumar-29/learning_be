"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycDocumentRepository = void 0;
const kyc_repository_1 = require("../../kyc.repository");
const kycDetails_schema_1 = require("../schemas/kycDetails.schema");
class KycDocumentRepository extends kyc_repository_1.KycRepository {
    constructor() {
        super();
    }
    async create(data) {
        return await kycDetails_schema_1.KycModel.create(data);
    }
    async findOne(query) {
        return await kycDetails_schema_1.KycModel.findOne(query);
    }
    async findMany(filter) {
        const skip = (filter.page - 1) * filter.limit;
        const filterQueryBuilder = {};
        // text search
        if (filter?.search?.trim()) {
            const search = filter.search.trim();
            const re = new RegExp(search, "i"); // case-insensitive
            filterQueryBuilder.$or = [
                { name: re },
                { companyName: re },
                { email: re },
                { mobileNumber: re },
            ];
        }
        return await kycDetails_schema_1.KycModel.find().skip(skip).limit(filter.limit);
    }
}
exports.KycDocumentRepository = KycDocumentRepository;
