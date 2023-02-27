import express from "express";
import { WorkoutCtrl } from "../controllers/workout.ctrl";
import { authorization } from "../middleware/authorization";
import zodSchemaInjector from "../middleware/zodSchemaInjector";
import { paramsMongooseIdCheck } from "../validationSchemas/event.vali.sche";
import { workoutValiSchema } from "../validationSchemas/workout.vali.sche";

const workoutRouter = express.Router();

workoutRouter

  // #region : get requests

  // get workouts by categories
  // .get(
  //   "/filter",
  //   authorization,
  //   zodSchemaInjector(workoutValiSchema.byCat),
  //   WorkoutCtrl.getByCat
  // )

  // get singleWorkout
  .get(
    "/:id",
    authorization,
    zodSchemaInjector(paramsMongooseIdCheck),
    WorkoutCtrl.getOne
  )
  // get all workouts
  .get("/", authorization, WorkoutCtrl.getAll);

// #endregion

// #region : post requests

// create workout
workoutRouter.post(
  "/create",
  authorization,
  zodSchemaInjector(workoutValiSchema.create),
  WorkoutCtrl.create
);

// #endregion

// #region : delete requests

// delete workout
workoutRouter.delete(
  "/delete/:id",
  authorization,
  zodSchemaInjector(paramsMongooseIdCheck),
  WorkoutCtrl.deleteWorkout
);

// #endregion

// #region : patch

// update workout
workoutRouter.patch(
  "/update/:id",
  authorization,
  zodSchemaInjector(workoutValiSchema.update),
  WorkoutCtrl.update
);

// like workout
workoutRouter.patch(
  "/like/:id",
  authorization,
  zodSchemaInjector(paramsMongooseIdCheck),
  WorkoutCtrl.like
);

// dislike
workoutRouter.patch(
  "/dislike/:id",
  authorization,
  zodSchemaInjector(paramsMongooseIdCheck),
  WorkoutCtrl.dislike
);

// #endregion

export default workoutRouter;
