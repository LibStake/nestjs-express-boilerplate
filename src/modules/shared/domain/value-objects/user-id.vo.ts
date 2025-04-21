import * as assert from 'node:assert';

export class UserId {
    public constructor(public readonly id: number) {
        assert.ok(id > 0);
    }
}
