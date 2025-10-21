// @/models.ts
import { Table, Model, Column, DataType, PrimaryKey, AutoIncrement} from "sequelize-typescript";

@Table({ tableName: "LocationLp" })
export default class LocationLp extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare ID_LocationLp: number;

  //
  @Column({
    type: DataType.INTEGER,
  })
  declare ID_Platform_Items: number;

  // 🔹 Código o nombre corto de la ubicación (ej. "A1-R2-N3")
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare Codigo: string;

  // 🔹 Descripción más larga (ej. "Rack A, Nivel 2, Posición 3")
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare Descripcion: string;
}
