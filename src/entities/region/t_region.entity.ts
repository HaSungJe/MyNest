import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 't_region', comment: '지역정보'})
export class Region {
    @PrimaryGeneratedColumn({name: 'region_seq', comment: '지역번호', primaryKeyConstraintName: 'PK_Region'})
    region_seq: number;

    @Column({name: 'region_code', unique: true, nullable: false, comment: '지역코드', length: 7})
    region_code: string;

    @ManyToOne(() => Region, region => region.region_code, { nullable: true, onUpdate: "CASCADE", onDelete: "CASCADE" })
    @JoinColumn({name: 'region_parent_code', referencedColumnName: 'region_code', foreignKeyConstraintName: "Region_FK_Region"})
    region_parent_code: string;

    @Column({name: 'region_name', nullable: false, comment: '시도명', length: 15})
    region_name: string;

    @Column({name: 'use_yn', nullable: false, comment: '사용여부', default: 'Y', length: 1})
    use_yn: string;
}