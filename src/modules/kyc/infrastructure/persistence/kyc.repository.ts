export abstract class KycRepository {
  abstract create(data: any): Promise<any>;
  abstract findMany(query: any): Promise<any>;
  abstract findOne(query: any): Promise<any>;
}
