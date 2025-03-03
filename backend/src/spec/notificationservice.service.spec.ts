import { Test, TestingModule } from '@nestjs/testing';
import { NotificationserviceService } from './notificationservice.service';

describe('NotificationserviceService', () => {
  let service: NotificationserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationserviceService],
    }).compile();

    service = module.get<NotificationserviceService>(NotificationserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
