import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Options for ParseIdPipe.
 */
interface ParseIdPipeOptions {
    /**
     * Number of bytes for storing the ID.
     */
    bytes: number;
    /**
     * Whether the ID is unsigned or not.
     */
    unsigned: boolean;
    /**
     * Whether the ID can be zero or not.
     */
    allowZero: boolean;
}

/** Validate and convert incoming parameter to valid numeric DB ID */
@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
    private readonly maxValue: number;
    private readonly minValue: number;

    /**
     * Parse given value as an ID.
     * ID means a number that commonly used as index in database.
     * @param options Validation pipe options
     */
    public constructor(
        private readonly options: ParseIdPipeOptions = {
            bytes: 4,
            unsigned: true,
            allowZero: false,
        },
    ) {
        const bytes = Math.trunc(options.bytes);
        if (isNaN(bytes) || bytes <= 0)
            throw new RangeError('Invalid bytes range');

        this.maxValue = options.unsigned
            ? Math.pow(2, bytes * 8) - 1
            : Math.pow(2, bytes * 8 - 1) - 1;
        this.minValue = options.allowZero ? 0 : 1;
    }

    public transform(value: string) {
        const integerValue = parseInt(value, 10);
        if (isNaN(integerValue))
            throw new BadRequestException('Id is not a number');
        if (integerValue < this.minValue || integerValue > this.maxValue)
            throw new BadRequestException('Id exceeds max or min value');
        return integerValue;
    }
}
