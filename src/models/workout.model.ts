import mongoose, { Date, Document, Model } from "mongoose";

export interface IWorkout {
  title: string;
  desc: string;
  category: string;
  focuses: Array<string>;
  sets: number;
  reps: number;
  dropset: boolean;
  superSetWith: Array<string>;
  imgUrl: string;
  videoUrl: string;
  likes: Array<string>;
  comments: Array<string>;
  userId: string;
}

export interface IWorkoutDoc extends IWorkout, Document {}

export interface IWorkoutLeanDoc extends IWorkout {
  _id: mongoose.Types.ObjectId;
}

const eventSchema = new mongoose.Schema<IWorkout>(
  {
    title: {
      required: true,
      type: String,
    },
    desc: {
      required: true,
      type: String,
    },
    category: {
      // push | pull | legs
      type: String,
      required: true,
    },
    focuses: {
      // chest | abs | calves ...
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    dropset: {
      type: Boolean,
      required: true,
    },
    superSetWith: {
      type: [
        // array of workout ids
        {
          type: String,
        },
      ],
      default: [],
    },
    imgUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    likes: [
      // array of user ids
      {
        type: String,
        default: [],
      },
    ],
    comments: [
      // array of user ids
      {
        type: String,
        default: [],
      },
    ],
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutModel = mongoose.model<IWorkoutDoc>("Workout", eventSchema);
export default WorkoutModel;
