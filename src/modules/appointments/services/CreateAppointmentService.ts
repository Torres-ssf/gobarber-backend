import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreteAppointmentService {
  async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointment = await appointmentRepository.findByDate(
      appointmentDate,
    );

    if (findAppointment) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = appointmentRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreteAppointmentService;
