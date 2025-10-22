import Location from "../../models/smartpick/Location";


export const getUbicaciones = async (req: any, res: any) => {
  try {
    const ubicaciones = await Location.findAll({
      where: { State: true },
      order: [["Codigo", "ASC"]],
    });

    res.status(200).json(ubicaciones);
  } catch (error: any) {
    console.error("Error al obtener ubicaciones:", error);
    res.status(500).json({
      message: "Error al obtener ubicaciones",
      error: error.message,
    });
  }
};


export const createUbicacion = async (req:any, res:any) => {
  try {
    const { Zona, Tipo, CapacidadPeso, CapacidadVolumen, CaraRack, NumRack, NivelRack } = req.body;

    // 🧠 Generar código automáticamente
    let Codigo = "";
    let Descripcion = "";

    if (Tipo === "Rack" && CaraRack && NumRack && NivelRack) {
      // Ejemplo: R-A1-N1 → Refrigerados
      const prefix = Zona.startsWith("S") ? "S" : "R"; // o puedes hacerlo dinámico
      Codigo = `${prefix}-${CaraRack}${NumRack}-N${NivelRack}`;
      Descripcion = `Rack ${CaraRack}${NumRack} Nivel ${NivelRack} - ${Zona}`;
    }

    const nuevaUbicacion = await Location.create({
      Codigo,
      Descripcion,
      Zona,
      Tipo,
      CapacidadPeso,
      CapacidadVolumen,
      CaraRack,
      NumRack,
      NivelRack,
      Ocupada: false,
      State: true,
    });

    res.json(nuevaUbicacion);
  } catch (error) {
    console.error("❌ Error creando ubicación:", error);
    res.status(500).json({ message: "Error creando ubicación" });
  }
};