import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass, plainToClass } from 'class-transformer';
import User from '@modules/users/infra/typeorm/entities/User';

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.user.id;
    const { day, month, year } = req.query;

    const providerAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await providerAppointmentsService.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    const unexposedInformation = appointments.map(appointment => {
      return {
        ...appointment,
        user: classToClass(plainToClass(User, appointment.user)),
      };
    });

    return res.status(200).json(unexposedInformation);
  }
}
