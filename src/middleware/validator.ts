import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Password validation function (DRY)
const passwordValidation = (field: string) => [
  body(field)
    .trim()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[\W_]/).withMessage('Password must contain at least one special character.')
    .escape(),
];

export const validateUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format.")
    .escape(),

    ...passwordValidation("password"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // console.log(errors.array());
      res.status(400).json({
        message: errors.array().map((err) => err.msg).join(", "),
      });
      return;
    }
    next();
  }
];

export const validateUserUpdate = [
  ...passwordValidation("oldPassword"),
  ...passwordValidation("newPassword"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // console.log(errors.array());
      res.status(400).json({
        message: errors.array().map((err) => err.msg).join(", "),
      });
      return;
    }
    next();
  }
];
