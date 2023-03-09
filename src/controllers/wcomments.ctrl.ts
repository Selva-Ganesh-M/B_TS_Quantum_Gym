import WorkoutModel from "../models/workout.model";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { customError } from "../utils/customError";
import WCommentModel from "../models/Wcomment.model";
import { IWComment } from "../models/Wcomment.model";
import hasPrivilege from "../utils/hasPrivilege";

export const isWorkout = async (id: string, msg: string) => {
  const workout = await WorkoutModel.findById(id).lean();
  if (!workout) throw new customError(404, `${msg} failed: workout not found`);
  return workout;
};

export const isWComment = async (id: string, msg: string) => {
  const wcomment = await WCommentModel.findById(id).lean();
  if (!wcomment)
    throw new customError(404, `${msg} failed: wcomment not found`);
  return wcomment;
};

// get comments
const getComments = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    // check if the workout exists
    const workout = await isWorkout(req.params.id, "comments fetch");

    // fetch wcomments
    let wcomments = await WCommentModel.find({
      workoutId: req.params.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "getcomments success",
      payload: wcomments,
    });
  }
);

// create comment
const create = asyncHandler(
  async (req: Request<{}, {}, Omit<IWComment, "likes">>, res: Response) => {
    const { userId, workoutId, content } = req.body;

    // check if workout exists
    await isWorkout(workoutId, "create comment");

    // create comment
    const comment = new WCommentModel(req.body);
    const createdComment = await comment.save();

    // response
    res.status(201).json({
      statusText: "success",
      statusCode: 201,
      message: "new comment created",
      payload: createdComment,
    });
  }
);

// update comment
const update = asyncHandler(
  async (
    req: Request<{ id: string }, {}, { content: string }>,
    res: Response
  ) => {
    const { content } = req.body;

    // check if comment exists
    const comment = await isWComment(req.params.id, "update comment");

    hasPrivilege(comment.userId.toString(), req.user!._id.toString());

    // update comment
    const updatedComment = await WCommentModel.findByIdAndUpdate(
      req.params.id,
      { content },
      {
        upsert: true,
        new: true,
      }
    );

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "comment updated",
      payload: updatedComment,
    });
  }
);

// delete comment
const deleteWComment = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    // check comment's presence
    const comment = await isWComment(req.params.id, "delete comment");

    hasPrivilege(comment.userId.toString(), req.user!._id.toString());

    // delete comment
    const deletedComment = await WCommentModel.findByIdAndDelete(req.params.id);

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "comment deleted",
      payload: deletedComment,
    });
  }
);

// like a comment
const like = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    // verify comment's existence
    await isWComment(req.params.id, "like comment");

    // like comment
    const updatedComment = await WCommentModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          likes: req.user!._id,
        },
      },
      {
        upsert: true,
        new: true,
      }
    ).lean();

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "liked comment",
      payload: updatedComment,
    });
  }
);

// dislike a comment
const dislike = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    // verify comment's existence
    await isWComment(req.params.id, "dislike comment");

    // dislike comment
    const updatedComment = await WCommentModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          likes: req.user!._id,
        },
      },
      {
        upsert: true,
        new: true,
      }
    ).lean();

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "disliked comment",
      payload: updatedComment,
    });
  }
);

export const wCommentCtrl = {
  getComments,
  create,
  update,
  deleteWComment,
  like,
  dislike,
};
