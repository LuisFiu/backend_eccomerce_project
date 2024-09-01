import { passportCall } from "./passportCall.js";

export const Validator = (allowed, endpointName) => {
  return async (req, res, next) => {
    passportCall("current")(req, res, () => {
      if (allowed.includes(req.user.role)) {
        console.log(
          `${req.user.role} ${req.user.name} allowed for this endpoint: ${endpointName}`
        );
        return next();
      } else {
        console.log(
          `${req.user.role} ${req.user.name} isn't allowed for this endpoint: ${endpointName}`
        );

        res.status(401).send({ status: "error", message: "User Not Allowed" });
      }
    });
  };
};
