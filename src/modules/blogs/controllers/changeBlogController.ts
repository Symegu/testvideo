import { Request, Response } from "express";
import { BlogInputType } from "../../../input-output-types/blog-types";
import { blogsRepository } from "../blogsRepository";

export const changeBlogController = (req: Request<{id: string}, any, BlogInputType>, res: Response) => {
  const blogForChangeId = blogsRepository.findById(req.params.id)
  blogsRepository.changeById(req.body, blogForChangeId!.id)
  res.sendStatus(204)
}