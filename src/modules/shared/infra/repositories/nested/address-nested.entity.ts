import { Column } from 'typeorm';

export class AddressNestedEntity {
    @Column({ type: 'char', length: 2 })
    countryCode: string; // ISO 3166-1 alpha-2 (e.g., 'KR', 'US')

    @Column({ type: 'varchar', length: 100, nullable: true })
    countryName?: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    postalCode?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    region?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    district?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    street?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    building?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    addressLine1?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    addressLine2?: string;

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude?: number;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude?: number;
}
