import express from "express";
import { userCtrl } from "../controllers/user.ctrl";
import { authorization } from "../middleware/authorization";
import zodSchemaInjector from "../middleware/zodSchemaInjector";
import { paramsMongooseIdCheck } from "../validationSchemas/event.vali.sche";

const router = express.Router();

router.get(
  "/:id",
  authorization,
  zodSchemaInjector(paramsMongooseIdCheck),
  userCtrl.getUser
);

export const userRouter = router;
