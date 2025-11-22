// @/models.ts
import { Table, Model, Column, DataType, PrimaryKey, AutoIncrement, } from "sequelize-typescript";

@Table({ tableName: "ProductToPrint" })
export default class ProductToPrint extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare ID_ProductToPrint: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare ID_User: number;

  @Column({
    type: DataType.STRING,
  })
  declare item_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare Description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare Fecha_Fin: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare Fecha_Ini: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare Precio_especial: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare Precio_Venta: number;

  @Column({
    type: DataType.STRING,
  })
  declare Tipo_promo: string;

  @Column({
    type: DataType.STRING,
  })
  declare Tecla: string;

  @Column({
    type: DataType.STRING,
  })
  declare Upc: string;

  @Column({
    type: DataType.STRING,
  })
  declare NombreProveedor: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  declare State: boolean;
}
