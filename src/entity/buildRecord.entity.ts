import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity()
export class BuildRecord {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  appName: string

  @Column()
  buildType: string

  @Column()
  branch: string

  @Column()
  buildTime: Date

  @Column()
  buildNumber: string

  @Column()
  filePath: string

  @Column({ nullable: true })
  fileName: string

  @CreateDateColumn()
  createdAt: Date
}
