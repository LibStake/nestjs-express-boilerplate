export class ServerResponseType<T> {
    public constructor(
        public readonly statusCode: number,
        public readonly data?: T,
        public readonly message?: string,
        public readonly error?: string
    ) {}
}
