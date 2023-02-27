import express from "express";
import { wCommentCtrl } from "../controllers/wcomments.ctrl";
import { authorization } from "../middleware/authorization";
import zodSchemaInjector from "../middleware/zodSchemaInjector";
import { paramsMongooseIdCheck } from "../validationSchemas/event.vali.sche";
import { wCommentvalische } from "../validationSchemas/wcomment.vali.sche";

const router = express.Router();

// routes

// get all comments
router.get(
  "/:id", //workout id
  authorization,
  zodSchemaInjector(wCommentvalische.getAll),
  wCommentCtrl.getComments
);

// delete commens
router.delete(
  "/delete/:id", //wcomment id
  authorization,
  zodSchemaInjector(wCommentvalische.deleteWComment),
  wCommentCtrl.deleteWComment
);

// update comments
router.patch(
  "/update/:id", // wcomment id
  authorization,
  zodSchemaInjector(wCommentvalische.update),
  wCommentCtrl.update
);

// create comment
router.post(
  "/create",
  authorization,
  zodSchemaInjector(wCommentvalische.create),
  wCommentCtrl.create
);

// like comment
router.patch(
  "/like/:id",
  authorization,
  zodSchemaInjector(paramsMongooseIdCheck),
  wCommentCtrl.like
);

// dislike comment
router.patch(
  "/dislike/:id",
  authorization,
  zodSchemaInjector(paramsMongooseIdCheck),
  wCommentCtrl.dislike
);

export const wCommentRouter = router;
