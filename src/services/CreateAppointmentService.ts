import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Param {
  provider: string;
  date: Date;
}

class CreteAppointmentService {
  appointmentRepository: AppointmentsRepository;

  constructor(appointmentRepository: AppointmentsRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  execute({ provider, date }: Param): Appointment {
    const findAppointment = this.appointmentRepository.findByDate(date);

    if (findAppointment) {
      throw new Error('This appointment is already booked');
    }

    const appointment = this.appointmentRepository.create({ provider, date });

    return appointment;
  }
}

export default CreteAppointmentService;
