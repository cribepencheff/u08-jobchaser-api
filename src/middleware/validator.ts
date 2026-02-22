import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Password validation function (DRY)
const passwordValidation = (field: string) => [
  body(field)
    .trim()
    .isLength({ min: 8 })
    .withMessage("password_min_length")
    .matches(/[\W_]/)
    .withMessage("password_special_char")
    .escape(),
];

export const validateUser = [
  body("email").trim().isEmail().withMessage("invalid_email_format").escape(),

  ...passwordValidation("password"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // console.log(errors.array());
      res.status(400).json({
        messageKey: errors
          .array()
          .map((err) => err.msg)
          .join(", "),
      });
      return;
    }
    next();
  },
];

export const validateUserUpdate = [
  ...passwordValidation("oldPassword"),
  ...passwordValidation("newPassword"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // console.log(errors.array());
      res.status(400).json({
        messageKey: errors
          .array()
          .map((err) => err.msg)
          .join(", "),
      });
      return;
    }
    next();
  },
];
