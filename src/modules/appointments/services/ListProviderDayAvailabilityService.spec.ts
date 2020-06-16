import 'reflect-metadata';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

interface IRandomNumber {
  min: number;
  max: number;
}

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

const randomNumber = ({ min, max }: IRandomNumber): number => {
  return min + Math.floor((max - min) * Math.random());
};

describe('ListProviderDayAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability', async () => {
    const serviceTime = Array.from({ length: 10 }, (_, index) => index + 8);

    await Promise.all(
      serviceTime.map(hour => {
        return fakeAppointmentsRepository.create({
          provider_id: 'provider01',
          user_id: 'user01',
          date: new Date(2020, 4, 12, hour),
        });
      }),
    );

    const appointments = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider01',
      day: 12,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual(
      expect.arrayContaining([
        { hour: randomNumber({ min: 8, max: 17 }), available: false },
        { hour: randomNumber({ min: 8, max: 17 }), available: false },
        { hour: randomNumber({ min: 8, max: 17 }), available: false },
        { hour: randomNumber({ min: 8, max: 17 }), available: false },
        { hour: randomNumber({ min: 8, max: 17 }), available: false },
      ]),
    );
  });

  it('should be able to invalidate past time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 12, 11).getTime();
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider01',
      user_id: 'user01',
      date: new Date(2020, 4, 12, 13),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider01',
      user_id: 'user01',
      date: new Date(2020, 4, 12, 15),
    });

    const appointments = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider01',
      day: 12,
      month: 5,
      year: 2020,
    });

    const pastAppointments = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider01',
      day: 1,
      month: 1,
      year: 2020,
    });

    expect(appointments).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: false },
        { hour: 14, available: true },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );

    expect(pastAppointments).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: false },
        { hour: 13, available: false },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: false },
        { hour: 17, available: false },
      ]),
    );
  });
});
