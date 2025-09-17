// @/models.ts
import { Table, Model, Column, DataType, PrimaryKey, AutoIncrement} from "sequelize-typescript";

@Table({ tableName: "Order" })
export default class Order extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  declare tranid: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare trandate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare transferlocation: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare useitemcostastransfercost: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare firmed: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  declare Completed: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare State: boolean;
}