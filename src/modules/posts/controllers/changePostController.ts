import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostInputType } from '../../../input-output-types/post-types'

export const changePostController = async (req: Request<({id: string}), any, PostInputType>, res: Response) => {
  const updateStatus = await postsRepository.changeById(req.body, req.params.id)
  if(updateStatus === null) {
    res.sendStatus(404)
    return
  }
  if(!updateStatus) {
    res.sendStatus(404)
    return
  }
  res.sendStatus(204)
}