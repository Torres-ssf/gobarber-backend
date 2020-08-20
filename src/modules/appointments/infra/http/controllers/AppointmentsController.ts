import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { startOfHour } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { provider_id, date } = req.body;

    const parsedDate = startOfHour(date);

    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );

    const appointment = await createAppointmentService.execute({
      provider_id,
      user_id,
      date: parsedDate,
    });

    return res.json({ appointment });
  }
}
