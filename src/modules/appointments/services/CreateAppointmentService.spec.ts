import CreateAppointment from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

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
});
