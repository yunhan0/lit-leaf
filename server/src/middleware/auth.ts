import { Request, Response, NextFunction } from "express";

export function authRequired(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.passport?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}
