import allowedOrigins from "./allowedOrigins";

export type TOriginCallBack = (err: Error | null, access: boolean) => void;

const corsOptions = {
  origin: (origin: string | undefined, callback: TOriginCallBack) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      // allowedOrigins.indexOf(origin) !== -1
      // if received origin not in the allowed origins
      // !origin
      // if no origin - [mobile apps, curl requests, postman ...]
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
console.log(corsOptions.origin);

export default corsOptions;
