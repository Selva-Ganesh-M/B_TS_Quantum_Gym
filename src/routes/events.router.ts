import express from "express";
import authController from "../controllers/auth.ctrl";
import { eventctrl } from "../controllers/event.ctrl";
import { authorization } from "../middleware/authorization";
import zodSchemaInjector from "../middleware/zodSchemaInjector";
import { authSchema } from "../validationSchemas/authSchema";
import {
  eventVSchema,
  paramsMongooseIdCheck,
} from "../validationSchemas/event.vali.sche";

const router = express.Router();

// create event
router.post(
  "/create",
  authorization,
  zodSchemaInjector(eventVSchema.create),
  eventctrl.create
);

// enroll event
router.patch(
  "/enroll/:id",
  authorization,
  zodSchemaInjector(eventVSchema.enroll),
  eventctrl.enroll
);

// withdraw event
router.patch(
  "/withdraw/:id",
  authorization,
  zodSchemaInjector(eventVSchema.withdraw),
  eventctrl.withdraw
);

// search event
router.get(
  "/search",
  authorization,
  zodSchemaInjector(eventVSchema.search),
  eventctrl.search
);

// delete event
router.delete(
  "/delete/:id",
  authorization,
  zodSchemaInjector(paramsMongooseIdCheck),
  eventctrl.deleteEvent
);

// get all events
router.get("/", authorization, eventctrl.getAll);

export const eventsRouter = router;
