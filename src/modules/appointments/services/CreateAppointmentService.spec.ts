import 'reflect-metadata';
import CreateAppointment from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  let fakeAppointment: FakeAppointmentRepository;
  let createAppointment: CreateAppointment;

  beforeEach(() => {
    fakeAppointment = new FakeAppointmentRepository();
    createAppointment = new CreateAppointment(fakeAppointment);
  });

  it('should create an appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: 'newProviderId',
      user_id: 'user01',
      date: new Date(),
    });

    expect(appointment).toBeTruthy();
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('newProviderId');
  });

  it('should not be able to create 2 appointments in the same time', async () => {
    const appointmentDate = new Date();

    await createAppointment.execute({
      provider_id: 'newProviderId',
      user_id: 'user01',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: 'newProviderId',
        user_id: 'user01',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
