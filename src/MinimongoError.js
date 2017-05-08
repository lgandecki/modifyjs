export default function (message, options={}) {
  if (typeof message === "string" && options.field) {
    message += ` for field '${options.field}'`;
  }

  var e = new Error(message);
  e.name = "MinimongoError";
  return e;
};