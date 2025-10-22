// @/models.ts
import { Table, Model, Column, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";

@Table({ tableName: "Product" })
export default class Product extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare ID_Product: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare Description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare SKU: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare Marca: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare Pais: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare ID_Categoria: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare Imagen: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  declare State: boolean;
}