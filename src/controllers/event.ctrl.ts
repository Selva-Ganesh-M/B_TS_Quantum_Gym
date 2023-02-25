import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import EventModel, { IPEvent } from "../models/events.model";
import { customError } from "../utils/customError";

const create = asyncHandler(
  async (req: Request<{}, {}, IPEvent>, res: Response) => {
    // create new event
    const event = new EventModel(req.body);
    const createdEvent = await event.save();

    // if event not created
    if (!createdEvent)
      throw new customError(
        500,
        "event creation failed: mongoose returned null"
      );

    // sending response
    res.status(201).json({
      statusText: "success",
      statusCode: 201,
      message: "new event created",
      payload: createdEvent,
    });
  }
);

export const eventctrl = { create };
