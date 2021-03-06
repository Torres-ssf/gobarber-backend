import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isBefore } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

interface IResquest {
  user_id: string;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public async execute({
    provider_id,
    year,
    month,
  }: IFindAllInMonthFromProviderDTO): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 17, 0, 0);

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available:
          isBefore(new Date(Date.now()), compareDate) &&
          appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
