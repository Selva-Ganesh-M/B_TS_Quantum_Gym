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

// enroll event
const enroll = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    // check if the event exist
    const event = await EventModel.findById(id);

    // if event not exist throw error
    if (!event)
      throw new customError(
        404,
        "enroll event  failed: requested event not found"
      );

    // enroll event
    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          registrations: req.user?._id,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    // if mongoose sent null throw error
    if (!updatedEvent)
      throw new customError(500, "enroll event failed: mongoose returned null");

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "enroll event successful",
      payload: updatedEvent,
    });
  }
);

// withdraw event
const withdraw = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    // check if the event exist
    const event = await EventModel.findById(id);

    // if event not exist throw error
    if (!event)
      throw new customError(
        404,
        "enroll event  failed: requested event not found"
      );

    // enroll event
    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          registrations: req.user?._id,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    // if mongoose sent null throw error
    if (!updatedEvent)
      throw new customError(
        500,
        "withdraw event failed: mongoose returned null"
      );

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "withdraw from event successful",
      payload: updatedEvent,
    });
  }
);

export const eventctrl = { create, getAll, enroll, withdraw };
