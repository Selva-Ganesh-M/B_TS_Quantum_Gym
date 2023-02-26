import mongoose from "mongoose";
import {
  z,
  object,
  string,
  TypeOf,
  number,
  date,
  array,
  any,
  ZodAny,
  boolean,
} from "zod";

// schemas

// create
const create = z.object({
  body: object({
    title: string({
      required_error: "title is a required field",
    }),
    desc: string({
      required_error: "desc is a required field",
    }),
    category: string({
      required_error: "category is a required field",
    }),
    fouses: array(
      string({
        required_error: "focuses is a required field",
      })
    ),
    sets: number({ required_error: "sets is a required field" }).min(1).max(8),
    reps: number({ required_error: "sets is a required field" })
      .min(-1)
      .max(30),
    dropset: boolean({ required_error: "dropset is a required field" }),
    superSetWith: array(string()),
    imgUrl: string({
      required_error: "imgUrl is a required field",
    }),
    videoUrl: string({
      required_error: "videoUrl is a required field",
    }),
    userId: string({ required_error: "userId is a required field" }).refine(
      (userId) => mongoose.isValidObjectId(userId),
      { message: "invalid userId is provided" }
    ),
  }),
});

// update
const update = z.object({
  body: object({
    title: string(),
    desc: string(),
    category: string(),
    fouses: array(string()),
    sets: number().min(1).max(8),
    reps: number().min(-1).max(30),
    dropset: boolean(),
    superSetWith: array(string()),
    imgUrl: string({}),
    videoUrl: string({}),
    userId: string({ required_error: "userId is a required field" }).refine(
      (userId) => mongoose.isValidObjectId(userId),
      { message: "invalid userId is provided" }
    ),
  }),
});

// exporting
export const workoutValiSchema = { create, update };
