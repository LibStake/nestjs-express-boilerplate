import * as assert from 'node:assert';

import { ValueObjectInterface } from '../../../interfaces/ValueObject.interface';

export class Address implements ValueObjectInterface {
    public constructor(
        /** ISO 3166-1 alpha-2 format e.g. `US` */
        public readonly countryCode: string,
        public readonly postalCode: string | null,
        public readonly region: string | null,
        public readonly city: string | null,
        public readonly district: string | null,
        public readonly street: string | null,
        public readonly addressLine1: string | null,
        public readonly addressLine2: string | null,
        public readonly latitude: number | null,
        public readonly longitude: number | null,
    ) {
        assert.ok(countryCode?.length === 2);
    }

    /**
     * Return pair of latitude and longitude
     */
    public get coordinate() {
        return [this.latitude, this.longitude];
    }

    public toLocaleString(locale: 'EN' | 'EU' | 'KO' = 'EN') {
        switch (locale) {
            case 'EU':
                return [].join(', ');
            case 'KO':
                return [].join(' ');
            default:
                return [].join(', ');
        }
    }
}
