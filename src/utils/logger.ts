import pino from "pino";

const transport = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
  },
});

const log = pino(
  {
    base: {
      pid: false,
    },
  },
  transport
);

export default log;
