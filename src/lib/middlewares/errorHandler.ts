import { Request, Response, NextFunction } from "express";
export const error404 = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({code: 404, error: "route does not exist"});
  }
}