import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.user.id;
    const { day, month, year } = req.body;

    const providerAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await providerAppointmentsService.execute({
      provider_id,
      day,
      month,
      year,
    });

    return res.status(200).json(appointments);
  }
}
