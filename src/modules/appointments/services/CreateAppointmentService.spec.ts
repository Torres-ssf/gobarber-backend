import 'reflect-metadata';
import CreateAppointment from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

describe('CreateAppointment', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let fakeUsersRepository: FakeUsersRepository;
  let fakeNotificationRepository: FakeNotificationRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let createAppointment: CreateAppointment;

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointment(
      fakeAppointmentRepository,
      fakeUsersRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });

  it('should not be able to create an appointment if given provider id does not belong to a user', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1, 9).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'ProviderId',
        user_id: 'user01',
        date: new Date(2020, 4, 10, 10),
      }),
    ).rejects.toHaveProperty(
      'message',
      'no user found for the given provider id',
    );
  });

  it('should not be able to create an appointment if given provider id belongs to a user who is not a provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1, 9).getTime();
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: '123456',
      provider: false,
    });

    await expect(
      createAppointment.execute({
        provider_id: user.id,
        user_id: 'user01',
        date: new Date(2020, 4, 10, 10),
      }),
    ).rejects.toHaveProperty(
      'message',
      'given provider id belongs to a user who is not a provider',
    );
  });

  it('should not be able to create 2 appointments in the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 1, 1, 12).getTime();
    });

    const appointmentDate = new Date(2020, 1, 1, 13);

    await createAppointment.execute({
      provider_id: 'ProviderId',
      user_id: 'user01',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: 'ProviderId',
        user_id: 'user01',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1, 10).getTime();
    });

    const appointmentDate = new Date(2020, 1, 1, 9);

    await expect(
      createAppointment.execute({
        provider_id: 'ProviderId',
        user_id: 'user01',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 1, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'ProviderId',
        user_id: 'ProviderId',
        date: new Date(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5am', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 1, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'ProviderId',
        user_id: 'UserId',
        date: new Date(2020, 1, 2, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: 'ProviderId',
        user_id: 'UserId',
        date: new Date(2020, 1, 2, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should create an appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1, 9).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: 'ProviderId',
      user_id: 'user01',
      date: new Date(2020, 4, 10, 10),
    });

    expect(appointment).toBeTruthy();
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('ProviderId');
  });
});
