import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreteAppointmentService {
  async execute({ provider, date }: Request): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentsRepository);

    const findAppointment = await appointmentRepository.findByDate(date);

    if (findAppointment) {
      throw new Error('This appointment is already booked');
    }

    const appointment = appointmentRepository.create({ provider, date });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreteAppointmentService;
