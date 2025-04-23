/** See https://www.npmjs.com/package/libphonenumber-js */

import * as assert from 'node:assert';

import parsePhoneNumberFromString, {
    isValidPhoneNumber,
    PhoneNumber as LibPhoneNumber,
} from 'libphonenumber-js';

import { ValueObjectInterface } from '../../../interfaces/ValueObject.interface';

export class PhoneNumber implements ValueObjectInterface {
    private readonly _phoneNumber: LibPhoneNumber;

    public constructor(number: string) {
        assert.ok(isValidPhoneNumber(number));
        // As `isValidPhoneNumber` is true, parse result will not be undefined
        this._phoneNumber = parsePhoneNumberFromString(
            number,
        ) as LibPhoneNumber;
    }

    /**
     * Return E.164 string (`+1234567890`)
     */
    public get phoneNumber() {
        return this._phoneNumber.formatInternational();
    }

    /**
     * Return country code according to ISO 3166-1 alpha-2
     * If number has no eligible country, returns null according to library
     * ```Will be undefined when no country could be derived from the phone number. For example, when several countries have the same countryCallingCode and the nationalNumber doesn't look like it belongs to any of them. Or when a number belongs to a non-geographic numbering plan.```
     */
    public get countryCode() {
        return this._phoneNumber.country ?? null;
    }

    /**
     * Return country calling code e.g. `+82`
     */
    public get countryCallingCode() {
        return `+${this._phoneNumber.countryCallingCode}`;
    }

    public get dialingNumber() {
        return this._phoneNumber.countryCallingCode;
    }

    /**
     * Convert phone number into it's locale string
     */
    public toLocalString() {
        return this._phoneNumber.formatNational();
    }

    /**
     * Convert phone number as E.164 string (`+1234567890`)
     */
    public toIntlString() {
        return this._phoneNumber.formatInternational();
    }
}
