import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { HttpError } from "../../../../../common/errors/http.error";
import { env } from "../../../../../config/env";
import { ParcelXOrderPayload } from "../../../mapper/parcel-x-order.mapper";

type ParcelXApiResponse<T = any> = {
  statusCode: number;
  data: T;
};

export class ParcelXClient {
  private readonly client: AxiosInstance;

  constructor() {
    if (!env.parcelX.accessKey || !env.parcelX.secretKey) {
      throw new HttpError(
        500,
        "Missing ParcelX API credentials in environment variables",
      );
    }

    const rawToken = `${env.parcelX.accessKey}:${env.parcelX.secretKey}`;
    const encodedToken = Buffer.from(rawToken).toString("base64");

    this.client = axios.create({
      baseURL: env.parcelX.apiUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedToken}`,
      },
    });
  }

  async createOrder(payload: ParcelXOrderPayload): Promise<ParcelXApiResponse> {
    return {
      statusCode: 200,
      data: {
        success: true,
        message: "Mocked ParcelX order creation successful",
        data: payload,
      },
    };
    // return this.request({
    //   url: "/api/v3/order/create_order",
    //   method: "POST",
    //   data: payload,
    // });
  }

  async orderCancellation(payload: any): Promise<any> {
    return this.request({
      url: "/api/v3/order/cancel_order",
      method: "POST",
      data: payload,
    });
  }

  async createWarehouse(
    payload: Record<string, unknown>,
  ): Promise<ParcelXApiResponse> {
    return this.request({
      url: "/api/v1/warehouse/create",
      method: "POST",
      data: payload,
    });
  }

  async updateNdr(
    payload: Record<string, unknown>,
  ): Promise<ParcelXApiResponse> {
    return this.request({
      url: "/api/v1/ndr/update",
      method: "POST",
      data: payload,
    });
  }

  async createB2B(
    payload: Record<string, unknown>,
  ): Promise<ParcelXApiResponse> {
    return this.request({
      url: "/api/v1/b2b/create",
      method: "POST",
      data: payload,
    });
  }

  private async request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<ParcelXApiResponse<T>> {
    try {
      const response = await this.client.request<T>(config);
      return {
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      console.log(error, "error in parcelx client");
      const err = error as AxiosError<any>;
      const errorSnapshot = {
        status: err.response?.status ?? null,
        statusText: err.response?.statusText ?? null,
        data: err.response?.data ?? null,
        headers: err.response?.headers ?? null,
        request: {
          method: config.method,
          url: `${this.client.defaults.baseURL}${config.url}`,
          timeout: config.timeout ?? this.client.defaults.timeout,
        },
        message: err.message,
        code: err.code ?? null,
      };

      console.error("ParcelX API error", JSON.stringify(errorSnapshot));

      throw new HttpError(
        err.response?.status || 500,
        JSON.stringify(errorSnapshot),
      );
    }
  }
}
