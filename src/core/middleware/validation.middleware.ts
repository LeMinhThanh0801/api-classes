import { NextFunction, Request, Response, RequestHandler } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { HttpException } from "@core/exception";

const validationMiddleware = (
  type: any,
  skipMissingProperties = false
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToClass(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.toString().length > 0) {
          const message = errors.toString();
          // .map((error: ValidationError) => {
          //   Object.values(error.constraints!);
          // })
          // .join(", ");
          next(new HttpException(400, message));
        } else {
          next();
        }
      }
    );
  };
};

export default validationMiddleware;
