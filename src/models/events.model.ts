import mongoose, { Date, Document, Model } from "mongoose";

export interface IPEvent {
  title: string;
  desc: string;
  date: Date;
  location: string;
  registrations: Array<string>;
  img: string;
  rating: number;
  userId: string;
}

export interface IPEventDoc extends IPEvent, Document {}

export interface IPEventLeanDoc extends IPEvent {
  _id: mongoose.Types.ObjectId;
}

const eventSchema = new mongoose.Schema<IPEvent>(
  {
    title: {
      required: true,
      type: String,
    },
    desc: {
      required: true,
      type: String,
    },
    date: {
      required: true,
      type: Date,
    },
    location: {
      type: String,
      required: true,
    },
    registrations: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
      default: [],
    },
    img: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EventModel = mongoose.model<IPEventDoc>("Event", eventSchema);
export default EventModel;
