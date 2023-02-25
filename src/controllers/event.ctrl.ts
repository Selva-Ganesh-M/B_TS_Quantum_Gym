import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import EventModel, { IPEvent } from "../models/events.model";
import { customError } from "../utils/customError";

// get all event
const getAll = asyncHandler(async (req: Request, res: Response) => {
  // fetching all posts
  const events = await EventModel.find();

  // if mongoose failed on fetching all posts
  if (!events)
    throw new customError(
      500,
      "fetching events failed: mongoose returned null"
    );

  // response
  res.status(200).json({
    statusText: "success",
    statusCode: 200,
    message: "fetch all events success",
    payload: events,
  });
});

// create event
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

export const eventctrl = { create, getAll };
