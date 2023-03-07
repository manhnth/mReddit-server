import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.sendStatus(200).json({ hello: 'hello there' });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
