import { RegisterWarehouseDto } from "../../warehouse/infrastructure/persistence/document/types/warehouse.types";

export type warehousePayload = {
  address_title: string;
  sender_name: string;
  full_address: string;
  business_name: string;
  phone: string;
  pincode: string;
};

export const mapWarehouseParcelXPayload = (
  registerWarehouse: RegisterWarehouseDto,
): warehousePayload => {
  return {
    address_title: registerWarehouse.addressTitle,
    business_name: registerWarehouse.businessName,
    full_address: registerWarehouse.fullAddress,
    phone: registerWarehouse.phone,
    pincode: registerWarehouse.pinCode,
    sender_name: registerWarehouse.senderName,
  };
};
