// @/models/Product.ts
import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Default
} from "sequelize-typescript";

@Table({
  tableName: "Products",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Product extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(14))
  declare upc: string;

  @AllowNull(true)
  @Column(DataType.STRING(14))
  declare ean: string | null;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare product_name: string;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  declare brand: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  declare category: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare ingredients: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  declare manufacturer: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare campaign_id: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare affiliate_ad_id: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  declare department: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  declare allergens: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare image_url: string | null;

  @AllowNull(false)
  @Default("gotoupc")
  @Column(DataType.STRING(50))
  declare source: string;

  // 🔹 CONTENIDO NETO
@AllowNull(true)
@Column(DataType.STRING(50))
declare net_quantity: string | null;

@AllowNull(true)
@Column(DataType.DECIMAL(10, 2))
declare net_quantity_value: number | null;

@AllowNull(true)
@Column(DataType.STRING(10))
declare net_quantity_unit: string | null;

// 🔹 PORCIONES
@AllowNull(true)
@Column(DataType.DECIMAL(5, 2))
declare servings_per_container: number | null;

@AllowNull(true)
@Column(DataType.DECIMAL(10, 2))
declare serving_size_value: number | null;

@AllowNull(true)
@Column(DataType.STRING(20))
declare serving_size_unit: string | null;

// 🔹 NUTRICIÓN
@AllowNull(true)
@Column(DataType.DECIMAL(8, 2))
declare calories: number | null;

@AllowNull(true)
@Column(DataType.DECIMAL(8, 2))
declare protein: number | null;

@AllowNull(true)
@Column(DataType.DECIMAL(8, 2))
declare fat_total: number | null;

@AllowNull(true)
@Column(DataType.DECIMAL(8, 2))
declare carbs_total: number | null;

@AllowNull(true)
@Column(DataType.DECIMAL(8, 2))
declare sugar: number | null;

@AllowNull(true)
@Column(DataType.DECIMAL(8, 2))
declare sodium: number | null;

// 🔹 METADATA
@AllowNull(true)
@Column(DataType.STRING(50))
declare country: string | null;

@AllowNull(true)
@Column(DataType.STRING(50))
declare language: string | null;

}
