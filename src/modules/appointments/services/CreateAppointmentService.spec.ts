import CreateAppointment from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('should create an appointment', async () => {
    const fakeAppointment = new FakeAppointmentRepository();

    const createAppointment = new CreateAppointment(fakeAppointment);

    const appointment = await createAppointment.execute({
      provider_id: 'newProviderId',
      date: new Date(),
    });

    expect(appointment).toBeTruthy();
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('newProviderId');
  });

  it('should not be able to create 2 appointments in the same time', async () => {
    const fakeAppointment = new FakeAppointmentRepository();

    const createAppointment = new CreateAppointment(fakeAppointment);

    const appointmentDate = new Date();

    await createAppointment.execute({
      provider_id: 'newProviderId',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: 'newProviderId',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
