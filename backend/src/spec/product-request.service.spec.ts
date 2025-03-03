import { Test, TestingModule } from '@nestjs/testing';
import { ProductRequestService } from 'src/products/services/productRequest.service';

describe('ProductRequestService', () => {
  let service: ProductRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRequestService],
    }).compile();

    service = module.get<ProductRequestService>(ProductRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
