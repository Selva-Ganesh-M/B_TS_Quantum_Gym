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
} from "zod";

const create = object({
  body: object({
    title: string({
      required_error: "title is a required field",
    }),
    desc: string({
      required_error: "desc is a required field",
    }),
    img: string({
      required_error: "img is a required field",
    }),
    location: string({
      required_error: "location is a required field",
    }),
    userId: string({
      required_error: "userId is a required field",
    }),
    date: z.string({
      required_error: "date is a required field",
    }),
    rating: number({
      required_error: "rating is a required field.",
    })
      .min(1)
      .max(5),
    registrations: array(
      string({
        required_error: "registrations is a required field",
      })
    ),
  }),
});

export const eventVSchema = { create };
