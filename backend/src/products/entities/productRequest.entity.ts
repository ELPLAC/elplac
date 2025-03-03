import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Seller } from '@sellers/sellers.entity';
import { Fair } from '@fairs/entities/fairs.entity';
import { Product } from '@products/entities/products.entity';
import { v4 as uuid } from 'uuid';
import { StatusProductRequest } from '@products/enum/statusProductRequest.enum';

@Entity()
export class ProductRequest {

    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();
  
    @Column()
    category: string;
    
    @Column()
    status: StatusProductRequest;
    
    @ManyToOne(() => Seller, (seller) => seller.productRequests)
    seller: Seller;

    @OneToMany(() => Product, (product) => product.productRequest)
    products: Product[];

    @ManyToOne(() => Fair, (fair) => fair.productRequests)
    fair: Fair;
}