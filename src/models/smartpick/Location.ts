// @/models.ts
import { Table, Model, Column, DataType, PrimaryKey, AutoIncrement} from "sequelize-typescript";

@Table({ tableName: "Location" })
export default class Location extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare ID_Ubicacion: number;

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

  // 🔹 Zona o área del CEDIS (ej. "Refrigerados", "Secos", "Salida")
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare Zona: string;

  // 🔹 Numero de pasillo (ej. "1", "2", "3")
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare Pasillo: number;

  // 🔹 Cara/lado del rack (ej. "A", "B")
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare CaraRack: string;

  // 🔹 Numero de Rack (ej. "1", "2", "3")
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare NumRack: number;

  // 🔹 Nivel de Rack (ej. "1", "2", "3")
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare NivelRack: number;

  // 🔹 Tipo de ubicación (ej. "Rack", "Piso", "Andén", "Devoluciones")
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare Tipo: string;

  // 🔹 Capacidad máxima de peso (kg)
  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare CapacidadPeso: number;

  // 🔹 Capacidad máxima de volumen (m³)
  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare CapacidadVolumen: number;

  // 🔹 Si está ocupada o disponible
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare Ocupada: boolean;

  // 🔹 ID del artículo o pallet actualmente almacenado (si aplica)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare ID_LP: number | null;

  // 🔹 Estado general (activo/inactivo)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare State: boolean;
}
