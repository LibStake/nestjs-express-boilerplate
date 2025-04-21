import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecordOrmEntity } from '../../../shared/infra/repositories/common/record-orm.entity';
import { UserOrmEntity } from '../../../shared/infra/repositories/user-orm.entity';

@Entity({ name: 'user_credentials' })
export class UserCredentialOrmEntity extends RecordOrmEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'user_id' })
    userId: number;
    @OneToOne(() => UserOrmEntity, user => user.credential, { nullable: false, cascade: true, lazy: true })
    @JoinColumn({ name: 'user_id' })
    user: Promise<UserOrmEntity>;

    @Column({ name: 'password_digest', type: 'char', length: 255, nullable: false })
    passwordDigest: string;
}