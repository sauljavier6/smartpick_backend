// @/models.ts
import { Table, Model, Column, DataType, PrimaryKey, AutoIncrement} from "sequelize-typescript";

@Table({ tableName: "Orderdep" })
export default class Orderdep extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare ID_Orderdep: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare iddepartamento: number; 

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare departamento: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare tranid: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare idpicker: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  declare Completed: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  declare State: boolean;
}