export abstract class ParcelXRepository {
    abstract create(requestLog: any): Promise<void>;
}