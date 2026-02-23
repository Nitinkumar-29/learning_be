import { KycRepository } from "../../kyc.repository";
import { KycModel } from "../schemas/kycDetails.schema";

export class KycDocumentRepository extends KycRepository {
  constructor() {
    super();
  }
  async create(data: any): Promise<any> {
    return await KycModel.create(data);
  }

  async findOne(query: any): Promise<any> {
    return await KycModel.findOne(query);
  }

  async findMany(filter: {
    page: any;
    limit: any;
    search: string;
  }): Promise<any> {
    const skip = (filter.page - 1) * filter.limit;
    const filterQueryBuilder: any = {};

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
    return await KycModel.find().skip(skip).limit(filter.limit);
  }
}
