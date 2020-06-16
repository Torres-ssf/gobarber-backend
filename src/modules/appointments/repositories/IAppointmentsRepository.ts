import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  show(): Promise<Appointment[]>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProviderDTO(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
}
