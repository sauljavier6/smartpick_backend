// @/models/UpcQueue.ts
import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default
} from "sequelize-typescript";

export enum UpcQueueStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
  ERROR = "ERROR",
}

@Table({
  tableName: "Upc_Queue",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class UpcQueue extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(14))
  declare upc: string;

  @AllowNull(false)
  @Default(UpcQueueStatus.PENDING)
  @Column(DataType.ENUM(...Object.values(UpcQueueStatus)))
  declare status: UpcQueueStatus;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare attempts: number;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare last_error: string | null;
}
