import { OrderRepository } from "../../orders/infrastructure/persistence/abstraction/order.repository";
import { NonRetryableJobError } from "../errors/job.errors";
import { ParcelXRepository } from "../infrastructure/persistence/abstraction/parcel-x-request.repository";
import { ParcelXResponseRepository } from "../infrastructure/persistence/abstraction/parcel-x-response.repository";

export class ParcelXOrderService {
  constructor(
    private parcelXRequestRepository: ParcelXRepository,
    private parcelXResponseRepository: ParcelXResponseRepository,
    private orderRepository: OrderRepository,
  ) {}

  // log request
  async logRequest(requestLog: any): Promise<void> {
    await this.parcelXRequestRepository.create(requestLog);
  }

  //   log response
  async logResponse(responseLog: any): Promise<void> {
    await this.parcelXResponseRepository.create(responseLog);
  }

  // process parcel x order job
  async processParcelXOrder(orderId: string): Promise<void> {
    const id = "699f37e76031ef1bf7db61c4"
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NonRetryableJobError(`Order with id ${orderId} not found`);
    }

    console.log(`Processing ParcelX order for orderId: ${orderId}`);

    // Implement the logic to process the ParcelX order
    // 1) build payload
    // 2) log request
    // 3) hit ParcelX API
    // 4) log response
    // 5) update order status + ref IDs
  }
}
