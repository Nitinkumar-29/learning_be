import { OrderController } from "./controllers/order.controller";
import { OrderDocumentRepository } from "./infrastructure/persistence/document/repositories/order-document.repository";
import { OrderService } from "./services/order.service";



const orderRepository = new OrderDocumentRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

export const orderModule = {
    orderService,
    orderController,
}