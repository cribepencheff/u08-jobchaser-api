import { Request, Response } from "express";

export const signUp = async (req: Request, res: Response) => {

  const { email, password } = req.body;
  console.log(email, password)
};

