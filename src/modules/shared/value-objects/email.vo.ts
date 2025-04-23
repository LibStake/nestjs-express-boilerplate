import * as assert from 'node:assert';

import { ValueObjectInterface } from '../../../interfaces/ValueObject.interface';

export class Email implements ValueObjectInterface {
    public constructor(public readonly email: string) {
        assert.ok(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/gi.test(email));
    }
}
