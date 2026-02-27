import { paymentMethods } from "../../../common/enums/order.enum";
import { CreateOrderDto } from "../../orders/infrastructure/persistence/document/types/order.type";

export type ParcelXOrderPayload = {
  client_order_id: string;
  consignee_emailid: string;
  consignee_pincode: string;
  consignee_mobile: string;
  consignee_phone: string;
  consignee_address1: string;
  consignee_address2: string;
  consignee_name: string;
  invoice_number: string;
  express_type: string;
  pick_address_id: string;
  return_address_id: string;
  cod_amount: string;
  tax_amount: string;
  mps: string;
  courier_type: number;
  courier_code: string;
  products: Array<{
    product_sku: string;
    product_name: string;
    product_value: string;
    product_hsnsac: string;
    product_taxper?: number;
    product_category: string;
    product_quantity: string;
    product_description: string;
  }>;
  address_type: string;
  payment_mode: "Prepaid" | "Cod";
  order_amount: string;
  extra_charges: string;
  shipment_width: string[];
  shipment_height: string[];
  shipment_length: string[];
  shipment_weight: string[];
};

const toStringNumber = (value: unknown): string => {
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  return "0";
};

const toIntegerString = (value: unknown): string => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  return String(Math.max(0, Math.round(num)));
};

const resolvePaymentMode = (paymentMethod: string): "Prepaid" | "Cod" => {
  return paymentMethod === paymentMethods.COD ? "Cod" : "Prepaid";
};

export const mapOrderToParcelXOrderPayload = (order: CreateOrderDto): ParcelXOrderPayload => {
  return {
    client_order_id: order.clientOrderId || "",
    consignee_emailid: order.consignee?.email || "",
    consignee_pincode: order.consignee?.pincode || "",
    consignee_mobile: order.consignee?.mobile || "",
    consignee_phone: order.consignee?.phone || "",
    consignee_address1: order.consignee?.address1 || "",
    consignee_address2: order.consignee?.address2 || "",
    consignee_name: order.consignee?.name || "",
    invoice_number: order.invoiceNumber || "",
    express_type: order.expressType || "surface",
    pick_address_id: order.pickAddressId || "",
    return_address_id: order.returnAddressId || "",
    cod_amount: toStringNumber(order.charges?.codAmount ?? 0),
    tax_amount: toStringNumber(order.charges?.taxAmount ?? 0),
    mps: toStringNumber(order.shipment?.mps ?? 0),
    courier_type: 0,
    courier_code: "",
    products: (order.items || []).map((item: any) => ({
      product_sku: item.sku || "",
      product_name: item.name || "",
      product_value: toStringNumber(item.unitPrice ?? 0),
      product_hsnsac: "",
      product_taxper: item.taxPercent ?? 0,
      product_category: item.category || "",
      product_quantity: toStringNumber(item.quantity ?? 0),
      product_description: item.description || "",
    })),
    address_type: order.consignee?.addressType || "OTHER",
    payment_mode: resolvePaymentMode(order.paymentMethod),
    order_amount: toStringNumber(order.charges?.orderAmount ?? 0),
    extra_charges: toStringNumber(order.charges?.extraCharges ?? 0),
    shipment_width: (order.shipment?.width || []).map(toIntegerString),
    shipment_height: (order.shipment?.height || []).map(toIntegerString),
    shipment_length: (order.shipment?.length || []).map(toIntegerString),
    shipment_weight: (order.shipment?.weight || []).map(toIntegerString),
  };
};
