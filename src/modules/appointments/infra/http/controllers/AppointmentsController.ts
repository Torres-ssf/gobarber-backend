import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { provider_id, date } = req.body;

    const parsedDate = startOfHour(parseISO(date));

    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );

    const appointment = await createAppointmentService.execute({
      provider_id,
      date: parsedDate,
    });

    return res.json({ appointment });
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const appointmentsRepository = new AppointmentsRepository();

    const appointments = await appointmentsRepository.show();

    return res.json(appointments);
  }
}
