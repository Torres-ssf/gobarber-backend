import 'reflect-metadata';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

interface IRandomNumber {
  min: number;
  max: number;
}

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

const provider_id = 'provider-id';
const year = 2020;
const month = 1;
const day = 1;

const randomNumber = ({ min, max }: IRandomNumber): number => {
  return min + Math.floor((max - min) * Math.random());
};

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(year, month, day, 7).getTime();
    });
  });

  it('should be able to list the day availability', async () => {
    const numOfAppointments = randomNumber({ min: 1, max: 10 });

    const appointmentsArr = [];

    for (let i = 0; i < numOfAppointments; i += 1) {
      appointmentsArr.push(
        fakeAppointmentsRepository.create({
          provider_id,
          user_id: 'user01',
          date: new Date(year, month, day, 8 + i),
        }),
      );
    }

    await Promise.all(appointmentsArr);

    const appointmentsFromProvider = await listProviderAppointmentsService.execute(
      { provider_id, day, month: month + 1, year },
    );

    expect(appointmentsFromProvider.length).toBe(numOfAppointments);
  });

  it('should be able to get data from the cache after beeing saved', async () => {
    const save = jest.spyOn(fakeCacheProvider, 'save');
    const recover = jest.spyOn(fakeCacheProvider, 'recover');

    fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'user01',
      date: new Date(),
    });

    await listProviderAppointmentsService.execute({
      provider_id,
      day,
      month: month + 1,
      year,
    });

    await listProviderAppointmentsService.execute({
      provider_id,
      day,
      month: month + 1,
      year,
    });

    await listProviderAppointmentsService.execute({
      provider_id,
      day,
      month: month + 1,
      year,
    });

    expect(save).toHaveBeenCalledTimes(1);
    expect(recover).toHaveBeenCalledTimes(3);
  });
});
