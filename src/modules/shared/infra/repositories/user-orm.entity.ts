import {
    Column,
    Entity,
    Index, OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { RecordOrmEntity } from './common/record-orm.entity';
import { AddressNestedEntity } from './nested/address-nested.entity';
import { UserCredentialOrmEntity } from '../../../auth/infra/repositories/user-credential-orm.entity';

@Entity({ name: 'users' })
export class UserOrmEntity extends RecordOrmEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Index()
    @Column({ name: 'email', type: 'varchar', length: 511, nullable: false, unique: true })
    email: string;

    @Index()
    @Column({ name: 'username', type: 'varchar', length: 127, nullable: false })
    username: string;

    @Column(() => AddressNestedEntity)
    address: AddressNestedEntity;

    @OneToOne(() => UserCredentialOrmEntity, credential => credential.user, { lazy: true })
    credential: Promise<UserCredentialOrmEntity>;
}
