import 'reflect-metadata';
import { setHours, setDate, getDate, getMonth, getYear } from 'date-fns';
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
    const timeNow = new Date();
    const tomorrow = setDate(timeNow, timeNow.getDate() + 1);
    const tomorrowAtSeven = setHours(tomorrow, 7);

    const serviceTime = Array.from({ length: 10 }, (_, index) => index + 8);

    await Promise.all(
      serviceTime.map(hour => {
        return fakeAppointmentsRepository.create({
          provider_id: 'provider01',
          user_id: 'User01',
          date: setHours(tomorrowAtSeven, hour),
        });
      }),
    );

    const appointments = await listProviderMonthAvailabilityService.execute({
      provider_id: 'provider01',
      month: getMonth(tomorrowAtSeven) + 1,
      year: getYear(tomorrowAtSeven),
    });

    expect(appointments).toEqual(
      expect.arrayContaining([
        { day: getDate(tomorrow) - 2, available: false },
        { day: getDate(tomorrow), available: false },
        { day: getDate(tomorrow) + 1, available: true },
      ]),
    );
  });
});
