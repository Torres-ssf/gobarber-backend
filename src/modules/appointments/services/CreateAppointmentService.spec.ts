import 'reflect-metadata';
import CreateAppointment from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  let fakeAppointment: FakeAppointmentRepository;
  let fakeNotificationRepository: FakeNotificationRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let createAppointment: CreateAppointment;

  beforeEach(() => {
    fakeAppointment = new FakeAppointmentRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointment(
      fakeAppointment,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
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
});
