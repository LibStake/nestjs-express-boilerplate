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

/** Validate and convert incoming parameter to valid ID */
@Injectable()
export class ParseIdPipe implements PipeTransform<string, number>{
    private readonly maxValue: number;
    private readonly minValue: number;

    /**
     * Parse given value as an ID.
     * ID means a number that commonly used as index in database.
     * @param options Validation pipe options
     */
    public constructor(
        private readonly options: ParseIdPipeOptions = { bytes: 4, unsigned: true, allowZero: false }
    ) {
        const bytes = Math.trunc(options.bytes);
        this.maxValue = options.unsigned
            ? Math.pow(2, bytes * 8) - 1
            : Math.pow(2, bytes * 8 - 1) - 1;
        this.minValue = options.allowZero ? 0 : 1;
    }

    public transform(value: string) {
        const intergerValue = parseInt(value, 10);
        if (isNaN(intergerValue))
            throw new BadRequestException('Invalid ID');
        if (intergerValue < this.minValue || intergerValue > this.maxValue)
            throw new BadRequestException('Invalid ID');
        return intergerValue;
    }
}
