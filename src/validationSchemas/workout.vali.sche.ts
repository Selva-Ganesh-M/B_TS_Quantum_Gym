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
    focuses: array(
      string({
        required_error: "focuses array cant't be empty",
      }),
      {
        required_error: "focuses is a required field",
      }
    ),
    sets: number({ required_error: "sets is a required field" }).min(1).max(8),
    reps: number({ required_error: "reps is a required field" })
      .min(-1)
      .max(30),
    dropset: boolean({ required_error: "dropset is a required field" }),
    superSetWith: array(
      string()
        .optional()
        // checking if every string value is a valid mongoose id
        .refine(
          (id) => {
            console.log("superset id is: ", id);
            return mongoose.isValidObjectId(id);
          },
          { message: "superSetWith has invalid workout ids" }
        ),
      {
        required_error: "superSetWith is a required field",
      }
    ),
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
    title: string().optional(),
    desc: string().optional(),
    category: string().optional(),
    focuses: array(string()).optional(),
    sets: number().min(1).max(8).optional(),
    reps: number().min(-1).max(30).optional(),
    dropset: boolean().optional(),
    superSetWith: array(string()).optional(),
    imgUrl: string().optional(),
    videoUrl: string().optional(),
    userId: string({ required_error: "userId is a required field" }).refine(
      (userId) => mongoose.isValidObjectId(userId),
      { message: "invalid userId is provided" }
    ),
  }),
});

// get by cat
const byCat = z.object({
  query: z.object({
    cat: string({ required_error: "category is a required field" }).refine(
      (cat) => cat !== "",
      { message: "category query string is empty." }
    ),
  }),
});

// exporting
export const workoutValiSchema = { create, update, byCat };
