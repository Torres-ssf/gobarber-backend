import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body;

    const sendForgotPasswordEmailService = container.resolve(
      ResetPasswordService,
    );

    await sendForgotPasswordEmailService.execute({ token, password });

    return res.status(204).send();
  }
}
