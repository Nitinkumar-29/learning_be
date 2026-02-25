export abstract class ParcelXResponseRepository {
    abstract create(responseLog: any): Promise<void>;
}