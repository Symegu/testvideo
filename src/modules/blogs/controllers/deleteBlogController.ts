import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";

export const deleteBlogController = async (req: Request<{ id: string }>, res: Response) => {
  const blog = await blogsRepository.deleteById(req.params.id)
  if (!blog) {
    res.sendStatus(404)
  }
  res.sendStatus(204)
}