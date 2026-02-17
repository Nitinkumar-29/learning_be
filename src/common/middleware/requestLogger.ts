import morgan from "morgan";

export const requestLogger = morgan((tokens, req, res) => {
  return [
    "\x1b[36m📡\x1b[0m",
    tokens.method(req, res),
    tokens.url(req, res),
    "\x1b[33m" + tokens.status(req, res) + "\x1b[0m",
    tokens["response-time"](req, res) + " ms",
  ].join(" ");
});
