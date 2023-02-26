import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import WorkoutModel, { IPWorkout } from "../models/workout.model";
import { customError } from "../utils/customError";
import hasPrivilege from "../utils/hasPrivilege";

export type TPWorkout = Omit<IPWorkout, "superSetWith" | "likes" | "comments">;

// get all workouts
const getAll = asyncHandler(async (req: Request, res: Response) => {
  // fetching workouts
  const workouts = await WorkoutModel.find();

  // response
  res.status(200).json({
    statusText: "success",
    statusCode: 200,
    message: "fetch workouts success",
    payload: workouts,
  });
});

// get one
const getOne = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const workout = await WorkoutModel.findById(req.params.id);

    if (!workout)
      throw new customError(404, "get one workout failed: workout not found");

    //   resonse
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "single workout fetch sucess",
      payload: workout,
    });
  }
);

// create workout
const create = asyncHandler(
  async (req: Request<{}, {}, TPWorkout>, res: Response) => {
    const data = req.body;

    // create workout
    const workout = new WorkoutModel(req.body);

    // save workout
    const newWorkout = await workout.save();

    // response
    res.status(201).json({
      statusText: "success",
      statusCode: 201,
      message: "new workout created",
      payload: newWorkout,
    });
  }
);

// delete a workout
const deleteWorkout = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id: workoutId } = req.params;
    const { _id: userId } = req.user!;

    // fetch the workout
    const workout = await WorkoutModel.findById(workoutId).lean();

    // if workout not found throw error
    if (!workout)
      throw new customError(
        404,
        "delete workout failed: requested workout not found"
      );

    // check if user have privilage to perform this operation
    hasPrivilege(workout.userId, userId.toString());

    // deleting the workout
    const deletedWorkout = await WorkoutModel.findByIdAndDelete(workoutId);

    if (!deletedWorkout)
      throw new customError(
        500,
        "delete operation failed: mongoose returned null when trying to delete"
      );

    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "workout deleted",
      payload: deletedWorkout,
    });
  }
);

// update workout
const update = asyncHandler(
  async (
    req: Request<{ id: string }, {}, Partial<TPWorkout>>,
    res: Response
  ) => {
    const { id: workoutId } = req.params;

    // check if workout exists
    const workout = await WorkoutModel.findById(workoutId);

    // if not workout throw error
    if (!workout)
      throw new customError(
        404,
        "update workout failed: requested workout not found"
      );

    // checking previlege
    hasPrivilege(workout.userId, req.user!._id.toString());

    // update the workout
    const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
      { _id: workoutId },
      req.body,
      {
        upsert: true,
        new: true,
      }
    );

    // response
    res.status(204).json({
      statusText: "success",
      statusCode: 204,
      message: "workout update successful",
      payload: updatedWorkout,
    });
  }
);

// like workout
const like = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    // check if workout
    const workout = await WorkoutModel.findById(req.params.id);

    if (!workout)
      throw new customError(
        404,
        "like workout failed: requested workout not found"
      );

    // like the workout
    const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          likes: req.user?._id,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    // response
    res.status(204).json({
      statusText: "success",
      statusCode: 204,
      message: "like a workout success",
      payload: updatedWorkout,
    });
  }
);

// dislike workout
const dislike = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    // check if workout
    const workout = await WorkoutModel.findById(req.params.id);

    if (!workout)
      throw new customError(
        404,
        "dislike workout failed: requested workout not found"
      );

    // dislike the workout
    const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          likes: req.user?._id,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    // response
    res.status(204).json({
      statusText: "success",
      statusCode: 204,
      message: "dislike a workout success",
      payload: updatedWorkout,
    });
  }
);

export const WorkoutCtrl = {
  getAll,
  create,
  deleteWorkout,
  update,
  getOne,
  like,
  dislike,
};
