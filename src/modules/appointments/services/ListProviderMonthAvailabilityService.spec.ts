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

  it('should be able to show user', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider01',
      date: new Date(2020, 3, 12, 17, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider01',
      date: new Date(2020, 4, 12, 17, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider01',
      date: new Date(2020, 4, 12, 16, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider01',
      date: new Date(2020, 4, 10, 14, 0),
    });

    const appointments = await listProviderMonthAvailabilityService.execute({
      provider_id: 'provider01',
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual(
      expect.arrayContaining([
        { day: 12, available: false },
        { day: 10, available: false },
        { day: 14, available: true },
        { day: 19, available: true },
      ]),
    );
  });
});
