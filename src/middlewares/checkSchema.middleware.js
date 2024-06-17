import { BadRequestError } from "../helper/custom-errors.js";

const checkSchema = ({ schema }) => {
  return async (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }

    return next();
  };
};

export default checkSchema;
