import mongoose, { Document } from "mongoose";

export interface IWComment {
  userId: string;
  workoutId: string;
  content: string;
  likes: Array<string>;
}

export interface IWCommentDoc extends IWComment, Document {}

export interface IWCommentLeanDoc extends IWComment {
  _id: mongoose.Types.ObjectId;
}

const WcommentSchema = new mongoose.Schema<IWComment>(
  {
    userId: {
      type: String,
      required: true,
    },
    workoutId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const IWCommentModel = mongoose.model("WComment", WcommentSchema);

export default IWCommentModel;
