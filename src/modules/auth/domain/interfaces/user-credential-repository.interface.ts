import { UserId } from '../../../shared/domain/value-objects/user-id.vo';
import { PasswordHash } from '../value-objects/password-hash.vo';


export interface UserCredentialRepositoryInterface {
    create(userId: UserId, passwordHash: PasswordHash): Promise<void>
    update(userId: UserId, passwordHash: PasswordHash): Promise<void>
}
