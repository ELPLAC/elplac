import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fair } from './entities/fairs.entity';

@Injectable()
export class FairsService {
  constructor(
    @InjectRepository(Fair)
    private fairsRepository: Repository<Fair>,
  ) {}

  async deleteFair(id: string): Promise<{ message: string }> {
    const fair = await this.fairsRepository.findOne({ where: { id } });
    if (!fair) throw new NotFoundException('Feria no encontrada');
    if (fair.isActive) throw new BadRequestException('No se puede eliminar una feria activa');

    await this.fairsRepository.remove(fair);
    return { message: 'Feria eliminada correctamente' };
  }
}