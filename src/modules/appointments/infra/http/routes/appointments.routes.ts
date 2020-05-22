import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import ensuredAuthenticated from '@modules/users/infra/http/middlewares/ensuredAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensuredAuthenticated);

appointmentsRouter.get('/', async (req, res) => {
  const appointmentsRepository = new AppointmentsRepository();

  const appointments = await appointmentsRepository.show();

  return res.json(appointments);
});

appointmentsRouter.post('/', async (req, res) => {
  const { provider_id, date } = req.body;

  const parsedDate = startOfHour(parseISO(date));

  const appointmentsRepository = new AppointmentsRepository();

  const createAppointmentService = new CreateAppointmentService(
    appointmentsRepository,
  );

  const appointment = await createAppointmentService.execute({
    provider_id,
    date: parsedDate,
  });

  return res.json({ appointment });
});

export default appointmentsRouter;
