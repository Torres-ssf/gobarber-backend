import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentsRepository;

  private notificationRepository: INotificationRepository;

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationRepository')
    notificationRepository: INotificationRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository;
    this.notificationRepository = notificationRepository;
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
      provider_id,
    );

    if (findAppointment) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'at' HH:mm");

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `A new appointment was scheduled for ${formattedDate}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
