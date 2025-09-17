import { Request, Response } from "express";
import { getReordenFormulado } from "../../services/oc/ordenCompra.service";
import { getVentas } from "../../services/oc/ventas.service";


function getSemanaCompletaActual(restaSemanas: number = 0, delAnioPasado: boolean = false) {
  const ahora = new Date();

  // Mover semanas hacia atrás
  ahora.setDate(ahora.getDate() - (restaSemanas * 7));

  if (delAnioPasado) {
    ahora.setFullYear(ahora.getFullYear() - 1);
  }

  // Obtener día de la semana (0 = domingo, 1 = lunes...)
  const diaSemana = ahora.getDay();

  // Calcular inicio (lunes)
  const inicio = new Date(ahora);
  const diferenciaInicio = diaSemana === 0 ? -6 : 1 - diaSemana;
  inicio.setDate(ahora.getDate() + diferenciaInicio);

  // Calcular fin (domingo)
  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + 6);

  const inicioStr = inicio.toISOString().split("T")[0];
  const finStr = fin.toISOString().split("T")[0];

  return { inicioStr, finStr };
}



// GET /api/product
export const getData = async (req: Request, res: Response) => {
    const idproveedor = req.query.idproveedor as string || "";
    const { inicioStr: inicioStr1, finStr: finStr1 } = getSemanaCompletaActual(1);
    console.log('inicioStr1',inicioStr1,'finStr1',finStr1)
    const { inicioStr: inicioStr2, finStr: finStr2 } = getSemanaCompletaActual(2);
    console.log('inicioStr2',inicioStr2,'finStr2',finStr2)
    const { inicioStr: inicioStr3, finStr: finStr3 } = getSemanaCompletaActual(3);
    console.log('inicioStr3',inicioStr3,'finStr3',finStr3)
    const { inicioStr: inicioStr4, finStr: finStr4 } = getSemanaCompletaActual(0, true);
    console.log('inicioStr4',inicioStr4,'finStr4',finStr4)
    const { inicioStr: inicioStr5, finStr: finStr5 } = getSemanaCompletaActual(1, true);
    console.log('inicioStr5',inicioStr5,'finStr5',finStr5)

  try {
    const items = await getReordenFormulado(idproveedor);

    const data = await Promise.all(
      items.map(async (item: { ID_Interno: string; location: string; }) => {
        const ventas1 = await getVentas(item.ID_Interno, item.location, inicioStr1, finStr1);
        const ventas2 = await getVentas(item.ID_Interno, item.location, inicioStr2, finStr2);
        const ventas3 = await getVentas(item.ID_Interno, item.location, inicioStr3, finStr3);
        const ventas4 = await getVentas(item.ID_Interno, item.location, inicioStr4, finStr4);
        const ventas5 = await getVentas(item.ID_Interno, item.location, inicioStr5, finStr5);

        return {
          ...item,
          ventas1,
          ventas2,
          ventas3,
          ventas4,
          ventas5
        };
      })
    );
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos' });
  }
};