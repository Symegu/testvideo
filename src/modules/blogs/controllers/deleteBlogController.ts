import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";

export const deleteBlogController = (req: Request<{ id: string }>, res: Response) => {
  const blog = blogsRepository.findById(req.params.id)
  blogsRepository.deleteById(blog!.id)

  res.sendStatus(204)
}