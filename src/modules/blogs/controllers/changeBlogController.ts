import { Request, Response } from "express";
import { BlogInputType } from "../../../input-output-types/blog-types";
import { blogsRepository } from "../blogsRepository";

export const changeBlogController = async (req: Request<{id: string}, any, BlogInputType>, res: Response) => {
  const updateStatus = await blogsRepository.changeById(req.body, req.params.id)
  if (!updateStatus) {
    res.sendStatus(404)
  }
  res.sendStatus(204)
}