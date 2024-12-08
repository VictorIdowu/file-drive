import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Delete trashed files",
  { minutes: 5 }, // every 5 minute
  internal.files.deleteAllFiles
);

export default crons;
