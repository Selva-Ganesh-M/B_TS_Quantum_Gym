import express from "express";
import authController from "../controllers/auth.ctrl";
import { eventctrl } from "../controllers/event.ctrl";
import { authorization } from "../middleware/authorization";
import zodSchemaInjector from "../middleware/zodSchemaInjector";
import { authSchema } from "../validationSchemas/authSchema";
import { eventVSchema } from "../validationSchemas/event.vali.sche";

const router = express.Router();

// create event
router.post(
  "/create",
  authorization,
  zodSchemaInjector(eventVSchema.create),
  eventctrl.create
);

// get all events
router.get("/", authorization, eventctrl.getAll);

export const eventsRouter = router;
