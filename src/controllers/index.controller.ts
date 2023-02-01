import { Request, Response } from 'express';

class IndexController {
  public index = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'hello world' });
  };
}

export default IndexController;
