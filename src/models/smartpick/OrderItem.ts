// @/models.ts
import { Table, Model, Column, DataType, PrimaryKey, AutoIncrement} from "sequelize-typescript";

@Table({ tableName: "Orderitem" })
export default class Orderitem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare ID_Orderitem: number; 

  @Column({
    type: DataType.INTEGER,
  })
  declare item: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare tranid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare memo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare upccode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare categoria: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare departamento: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare iddepartamento: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare quantity: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare line: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare custitem_nso_codigo_citadel: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  declare State: boolean;
}