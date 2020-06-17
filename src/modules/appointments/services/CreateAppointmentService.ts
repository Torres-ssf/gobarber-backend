import { startOfHour, isBefore, getHours } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreteAppointmentService {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (provider_id === user_id) {
      throw new AppError("You can't create an appointment with yourself");
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("Can't create an appointment on a past date");
    }

    const hour = getHours(appointmentDate);

    if (hour < 8 || hour > 17) {
      throw new AppError(
        "Appointments can't be created before 8am and after 5pm",
      );
    }

    const findAppointment = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointment) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreteAppointmentService;
