import * as assert from 'node:assert';

export class PasswordHash {
    public constructor(public readonly hash: string) {
        assert.ok(hash && hash.length > 0)
    }
}
