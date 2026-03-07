"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDocumentRepository = void 0;
const user_schema_1 = require("../schemas/user.schema");
const auth_repository_1 = require("../../abstraction/auth.repository");
class AuthDocumentRepository extends auth_repository_1.AuthRepository {
    constructor() {
        super();
    }
    async createUser(registerDto) {
        return await user_schema_1.User.create(registerDto);
    }
    async findByEmail(email) {
        return await user_schema_1.User.findOne({ email }).select("+password");
    }
    async findById(id) {
        return await user_schema_1.User.findById(id).select("+password");
    }
    async updateUser(id, updateData) {
        return await user_schema_1.User.findByIdAndUpdate(id, updateData, { new: true });
    }
    async findOne(filter) {
        return await user_schema_1.User.findOne(filter).select("+password +passwordResetToken +passwordResetExpires +tokenVersion");
    }
    async findMany(filter) {
        const page = Math.max(1, Number(filter?.page) || 1);
        const limit = Math.max(1, Number(filter?.limit) || 10);
        const skip = (page - 1) * limit;
        const filterQueryBuilder = {};
        // optional exact filters
        if (filter?.role)
            filterQueryBuilder.role = filter.role;
        if (typeof filter?.isActive === "boolean") {
            filterQueryBuilder.isActive = filter.isActive;
        }
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
        return await user_schema_1.User.find(filterQueryBuilder)
            .skip(skip)
            .limit(limit)
            .select("-password -passwordResetToken -passwordResetExpires -tokenVersion")
            .lean();
    }
    async totalUsers({ search, startDate, endDate, }) {
        const filterQueryBuilder = {};
        // text search
        if (search?.trim()) {
            search.trim();
            const re = new RegExp(search, "i"); // case-insensitive
            filterQueryBuilder.$or = [
                { name: re },
                { companyName: re },
                { email: re },
                { mobileNumber: re },
            ];
        }
        return await user_schema_1.User.countDocuments(filterQueryBuilder);
    }
}
exports.AuthDocumentRepository = AuthDocumentRepository;
