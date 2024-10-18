import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";

export const deleteBlogController = (req: Request<{ id: string }>, res: Response) => {
  const blog = blogsRepository.findById(req.params.id)
  blogsRepository.deleteById(req.params.id)
  if (!blog) {
    res.sendStatus(204)
    return
  }
  res.sendStatus(404)
}