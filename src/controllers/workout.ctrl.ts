import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import WCommentModel from "../models/Wcomment.model";
import WorkoutModel from "../models/workout.model";
import { customError } from "../utils/customError";
import hasPrivilege from "../utils/hasPrivilege";

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

// get all workouts
const getAll = asyncHandler(
  async (
    req: Request<{}, {}, {}, { cat: string; focuses: string; mine: string }>,
    res: Response
  ) => {
    // deciding which data to fetch
    const { cat, focuses: strFocuses, mine } = req.query;
    const focuses = strFocuses ? strFocuses.split(",") : null;
    console.log(cat);

    let workouts;
    console.log(req.query);

    const query: {
      category?: string;
      focuses?: { $in: string[] };
      userId?: string;
    } = {};
    if (cat) {
      query.category = cat;
    }
    if (focuses) {
      query.focuses = {
        $in: focuses,
      };
    }
    if (mine) {
      query.userId = req.user!._id.toString();
    }

    console.log(query);

    workouts = await WorkoutModel.find(query);
    workouts = workouts.sort((a, b) => b.likes.length - a.likes.length);

    console.log("workouts", workouts);

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "fetch workouts success",
      payload: workouts,
    });
  }
);

// search
const search = asyncHandler(
  async (
    req: Request<{}, {}, {}, { src: string; mine: string }>,
    res: Response
  ) => {
    const { src, mine } = req.query;

    let query: {
      title: {
        $regex: string;
        $options?: string;
      };
      userId?: string;
    } = {
      title: {
        $regex: src,
        $options: "i",
      },
    };

    if (mine) {
      query.userId = req.user!._id.toString();
    }

    console.log("query", query);

    const workouts = await WorkoutModel.find(query);
    console.log("workouts", workouts);

    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "search for workout success",
      payload: workouts,
    });
  }
);

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
  async (
    req: Request<{}, {}, Omit<IWorkout, "likes" | "comments">>,
    res: Response
  ) => {
    const data = req.body;

    // check if all ids in the superset are valid workout ids
    const response = await Promise.all(
      req.body.superSetWith.map(async (id) => {
        if (await WorkoutModel.findById(id)) {
          return true;
        } else {
          return false;
        }
      })
    );

    if (!response.every(Boolean)) {
      throw new customError(
        400,
        "create workout failed: supsetwith has valid mongoose ids but not workout ids"
      );
    }

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

    // deleting comments of the workout video
    await WCommentModel.deleteMany({ userId });

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
    req: Request<{ id: string }, {}, Partial<IWorkout>>,
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
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
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
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
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
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "dislike a workout success",
      payload: updatedWorkout,
    });
  }
);

const getByCat = asyncHandler(
  async (req: Request<{}, {}, {}, { cat: string }>, res: Response) => {
    const { cat } = req.query;

    // find workouts
    let workouts = await WorkoutModel.find({ category: cat }).lean();
    workouts = workouts.sort((a, b) => b.likes.length - a.likes.length);

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "fetch category success",
      payload: workouts,
    });
  }
);

export const WorkoutCtrl = {
  getAll,
  create,
  deleteWorkout,
  search,
  update,
  getOne,
  like,
  dislike,
  getByCat,
};
