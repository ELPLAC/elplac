import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@users/roles/roles.enum';
import { Seller } from '@sellers/sellers.entity';
import { SellerStatus } from '@sellers/sellers.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/users.entity';

@Injectable()
export class UserToSellerService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async changeRole(id: string, role: Role): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    const skuId = user.id[0] + user.id[1];
    const splitname = user.name.split(' ');
    splitname.push(user.lastname);
    const initials = splitname.map((element) => {
      return element[0];
    });
    const joinedInitials = initials.join('');
    if (role === Role.SELLER) {
      const newSeller = new Seller();
      newSeller.address = ' ';
      newSeller.phone = ' ';
      newSeller.user = user;
      newSeller.status = SellerStatus.NO_ACTIVE;
      newSeller.sku = `${joinedInitials}${skuId}`;
      newSeller.social_media = ' ';

      const seller = this.sellerRepository.create(newSeller);

      await this.sellerRepository.save(seller);

      user.role = Role.SELLER;
      user.seller = seller;
      await this.userRepository.save(user);
    } else if (role === Role.ADMIN) {
      user.role = Role.ADMIN;
    } else if (role === Role.USER) {
      user.role = Role.USER;
    }

    return await this.userRepository.save(user);
  }
}
