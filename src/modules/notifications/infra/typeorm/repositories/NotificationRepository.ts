import { MongoRepository, getMongoRepository } from 'typeorm';

import INotificatioRepository from '@modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

class NotificationRepository implements INotificatioRepository {
  private mongoOrmRepository: MongoRepository<Notification>;

  constructor() {
    this.mongoOrmRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.mongoOrmRepository.create({
      content,
      recipient_id,
    });

    this.mongoOrmRepository.save(notification);

    return notification;
  }
}

export default NotificationRepository;
