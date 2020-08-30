import 'reflect-metadata';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability', async () => {
    const scheduleTenAppointments = Array.from(
      { length: 10 },
      (_, index) => index + 8,
    );

    await Promise.all(
      scheduleTenAppointments.map(hour => {
        return fakeAppointmentsRepository.create({
          provider_id: 'provider01',
          user_id: 'user01',
          date: new Date(2020, 7, 17, hour),
        });
      }),
    );

    const scheduleNineAppointments = Array.from(
      { length: 9 },
      (_, index) => index + 8,
    );

    await Promise.all(
      scheduleNineAppointments.map(hour => {
        return fakeAppointmentsRepository.create({
          provider_id: 'provider01',
          user_id: 'user01',
          date: new Date(2020, 7, 18, hour),
        });
      }),
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 7, 17, 7).getTime();
    });

    const appointments = await listProviderMonthAvailabilityService.execute({
      provider_id: 'provider01',
      month: 8,
      year: 2020,
    });

    const appointmentsArr = [];

    for (let i = 1; i <= 31; i += 1) {
      if (i < 18) {
        appointmentsArr.push({ day: i, available: false });
      } else {
        appointmentsArr.push({ day: i, available: true });
      }
    }

    expect(appointments).toEqual(appointmentsArr);
  });
});
