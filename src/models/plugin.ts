import {Column, DataType, Model, Table,} from "sequelize-typescript";

export enum STATUS {
  CREATED = 'created',
  DEPLOYED = 'deployed'
}

export const statuses: string[] = Object.values(STATUS);

@Table({tableName: 'plugins', timestamps: true})
class Plugin extends Model {
  @Column
  name: string

  @Column
  description: string

  @Column({
    type: DataType.ENUM({values: statuses}),
    allowNull: false,
    defaultValue: STATUS.CREATED,
    validate: {isIn: [statuses],},
  })
  status: STATUS

  @Column(DataType.JSON)
  metadata: string

  @Column(DataType.STRING)
  contract: string

  @Column
  contractAddress: string

  @Column
  contractAbi: string
}

export default Plugin
