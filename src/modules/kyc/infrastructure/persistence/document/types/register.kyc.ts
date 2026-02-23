import { z } from "zod";
import {
  accountTypes,
  entityTypes,
  isGstOptions,
} from "../../../../../../common/enums/kyc.enum";

const mobileNumberSchema = z
  .string()
  .trim()
  .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits")
  .transform(Number);

const zipCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Zip code must be exactly 6 digits")
  .transform(Number);

export const registerKycSchema = z
  .object({
    entityName: z
      .string()
      .trim()
      .min(2, "Entity name must be at least 2 characters"),
    entityType: z.enum(Object.values(entityTypes), {
      message: "Invalid entity type",
    }),
    websiteUrl: z.url("Invalid website URL").optional(),
    email: z.email("Invalid email format").toLowerCase(),
    mobileNumber: mobileNumberSchema,
    billingAddress: z
      .string()
      .trim()
      .min(5, "Billing address must be at least 5 characters"),
    zipCode: zipCodeSchema,
    city: z.string().trim().min(2, "City must be at least 2 characters"),
    state: z.string().trim().min(2, "State must be at least 2 characters"),
    aadharNumber: z
      .string()
      .trim()
      .regex(/^\d{12}$/, "Aadhar number must be exactly 12 digits"),
    aadharCardFrontImageURL: z.url("Invalid Aadhaar front image URL").optional(),
    aadharCardBackImageURL: z.url("Invalid Aadhaar back image URL").optional(),
    panNumber: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
    panCardImageURL: z.url("Invalid PAN card image URL").optional(),
    isGst: z.enum(Object.values(isGstOptions)).optional().default(isGstOptions.NO),
    gstNumber: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/,
        "Invalid GST number format",
      )
      .optional(),
    gstCertificateLink: z.url("Invalid GST certificate URL").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isGst === isGstOptions.YES) {
      if (!data.gstNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GST number is required when GST is yes",
          path: ["gstNumber"],
        });
      }

      if (!data.gstCertificateLink) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GST certificate link is required when GST is yes",
          path: ["gstCertificateLink"],
        });
      }
    }
  });

export type RegisterKycDto = z.infer<typeof registerKycSchema>;

export const registerBankKycSchema = z.object({
  accountHolderName: z
    .string()
    .trim()
    .min(2, "Account holder name must be at least 2 characters"),
  accountType: z.enum(Object.values(accountTypes), {
    message: "Invalid account type",
  }),
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{9,18}$/, "Account number must be between 9 and 18 digits"),
  ifscCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
  bankName: z.string().trim().min(2, "Bank name must be at least 2 characters"),
  bankBranch: z
    .string()
    .trim()
    .min(2, "Bank branch must be at least 2 characters"),
  bankAddress: z.string().trim().optional(),
  cancelledChequeImageUrl: z.url("Invalid cancelled cheque image URL"),
  isOldCancelledChequeAccepted: z.boolean().optional().default(false),
  kycId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, "Invalid KYC id"),
});

export type RegisterBankKycDto = z.infer<typeof registerBankKycSchema>;
