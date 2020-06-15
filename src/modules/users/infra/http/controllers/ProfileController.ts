import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

export default class ProfileController {
  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { name, email, old_password, new_password } = req.body;

    const updateProfileService = container.resolve(UpdateProfileService);

    const updateUser = await updateProfileService.execute({
      user_id,
      name,
      email,
      old_password,
      new_password,
    });

    delete updateUser.password;

    return res.status(200).json(updateUser);
  }
}
