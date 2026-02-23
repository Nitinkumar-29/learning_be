import express from "express";
import { kycModule } from "../modules/kyc/kyc.module";
import { authModule } from "../modules/auth/auth.module";
import { userRole } from "../common/enums/auth.enum";
import { validate } from "../common/validator";
import {
  registerBankKycSchema,
  registerKycSchema,
} from "../modules/kyc/infrastructure/persistence/document/types/register.kyc";

const router = express.Router();

const { kycController } = kycModule;
const { authMiddleware } = authModule;

router.post(
  "/register",
  authMiddleware.protect,
  validate(registerKycSchema),
  kycController.registerKycDetails,
);
router.post(
  "/registerBankDetails",
  authMiddleware.protect,
  validate(registerBankKycSchema),
  kycController.registerBankKycDetails,
);
router.get(
  "/fetchDetails",
  authMiddleware.protect,
  kycController.fetchRegisteredKycDetails,
);
router.get(
  "/fetchBankDetails",
  authMiddleware.protect,
  kycController.fetchRegisteredBankKycDetails,
);
router.get(
  "/admin/listRegisteredKycs",
  authMiddleware.authorize(userRole.ADMIN),
  kycController.listRegisteredKycs,
);
router.delete(
  "/admin/deleteKyc/:id",
  authMiddleware.authorize(userRole.ADMIN),
  kycController.deleteKycDetails,
);

export const kycRouter = router;
