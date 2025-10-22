import { Request, Response } from "express";
import { getReordenFormulado } from "../../services/oc/ordenCompra.service";
import { getVentas } from "../../services/oc/ventas.service";


function getSemanaCompletaActual(
  moverSemanas: number = 0,
  delAnioPasado: boolean = false
) {
  const ahora = new Date();

  // Mover semanas hacia adelante (positivo) o atrás (negativo)
  ahora.setDate(ahora.getDate() + (moverSemanas * 7));

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


function calcularOutlier(valor: number, clasificacion: string, ventas: number[]): "Outlier" | "Normal" {
  let rango: number[] = [];

  if (clasificacion === "Comparable") {
    rango = ventas; // H2:N2
  } else if (clasificacion === "Nuevo") {
    rango = ventas.slice(0, 4); // H2:K2
  } else if (clasificacion === "Viejo") {
    rango = ventas.slice(4, 7); // L2:N2
  }

  const promedio = rango.reduce((acc, val) => acc + val, 0) / rango.length;
  const desviacion = Math.sqrt(rango.reduce((acc, val) => acc + Math.pow(val - promedio, 2), 0) / (rango.length - 1));

  return valor === 0 || valor > promedio + desviacion || valor < promedio - desviacion ? "Outlier" : "Normal";
}


function llenarOutnumbers(valores: (number | undefined)[]): number[] {
  const resultado: number[] = new Array(valores.length).fill(0);

  let ultimo = 0;
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] !== undefined && valores[i] !== null && valores[i] !== 0) {
      ultimo = valores[i]!;
    }
    resultado[i] = ultimo;
  }

  const hayNumero = resultado.some(v => v !== 0);
  return hayNumero ? resultado : new Array(valores.length).fill(0);
}


// GET /api/product
export const getData = async (req: Request, res: Response) => {
    const idproveedor = req.query.idproveedor as string || "";
    const leadtime = req.query.leadtime as string || "";

    //Resta de semanas a la semana actual
    const { inicioStr: inicioStr4, finStr: finStr4 } = getSemanaCompletaActual(-4);
    const { inicioStr: inicioStr3, finStr: finStr3 } = getSemanaCompletaActual(-3);
    const { inicioStr: inicioStr2, finStr: finStr2 } = getSemanaCompletaActual(-2);
    const { inicioStr: inicioStr1, finStr: finStr1 } = getSemanaCompletaActual(-1);
    //Semanas postegriores a la actual del año pasado
    const { inicioStr: inicioStr5, finStr: finStr5 } = getSemanaCompletaActual(1, true);
    const { inicioStr: inicioStr6, finStr: finStr6 } = getSemanaCompletaActual(2, true);
    const { inicioStr: inicioStr7, finStr: finStr7 } = getSemanaCompletaActual(3, true);

  try {
    const items = await getReordenFormulado(idproveedor);

    const data = await Promise.all(
      items.map(async (item: { ID_Interno: string; location: string; }) => {
        
        //Resta de semanas a la semana actual
        const ventas4 = Math.abs(await getVentas(item.ID_Interno, item.location, inicioStr4, finStr4));
        const ventas3 = Math.abs(await getVentas(item.ID_Interno, item.location, inicioStr3, finStr3));
        const ventas2 = Math.abs(await getVentas(item.ID_Interno, item.location, inicioStr2, finStr2));
        const ventas1 = Math.abs(await getVentas(item.ID_Interno, item.location, inicioStr1, finStr1));

        //Semanas postegriores a la actual del año pasado
        const ventas5 = Math.abs(await getVentas(item.ID_Interno, item.location, inicioStr5, finStr5));
        const ventas6 = Math.abs(await getVentas(item.ID_Interno, item.location, inicioStr6, finStr6));
        const ventas7 = Math.abs(await getVentas(item.ID_Interno, item.location, inicioStr7, finStr7));

        let Clasificación = 'Nuevo';

        if (ventas1 > 0 || ventas2 > 0 || ventas3 > 0 || ventas4 > 0) {
          Clasificación = 'Comparable';
        }

        if (ventas1 === 0 && ventas2 === 0 && ventas3 === 0 && ventas4 === 0 && (ventas5 > 0 || ventas6 > 0 || ventas7 > 0 )) {
          Clasificación = 'Viejo';
        }

        const ventas = [ventas1, ventas2, ventas3, ventas4, ventas5, ventas6, ventas7];

        const Outlier4 = calcularOutlier(ventas4, Clasificación, ventas);
        const Outlier3 = calcularOutlier(ventas3, Clasificación, ventas);
        const Outlier2 = calcularOutlier(ventas2, Clasificación, ventas);
        const Outlier1 = calcularOutlier(ventas1, Clasificación, ventas);
        const Outlier5 = calcularOutlier(ventas5, Clasificación, ventas);
        const Outlier6 = calcularOutlier(ventas6, Clasificación, ventas);
        const Outlier7 = calcularOutlier(ventas7, Clasificación, ventas);


        const outnumber4 = Outlier4==='Normal' ? ventas4 : '';
        const outnumber3 = Outlier3==='Normal' ? ventas3 : '';;
        const outnumber2 = Outlier2==='Normal' ? ventas2 : '';
        const outnumber1 = Outlier1==='Normal' ? ventas1 : '';
        const outnumber5 = Outlier5==='Normal' ? ventas5 : '';
        const outnumber6 = Outlier6==='Normal' ? ventas6 : '';
        const outnumber7 = Outlier7==='Normal' ? ventas7 : '';
        

        const outNumbers = [outnumber4, outnumber3, outnumber2, outnumber1, outnumber5, outnumber6, outnumber7];

        const linealOutnumbers = llenarOutnumbers(
          outNumbers.map(v => (typeof v === 'number' ? v : undefined))
        );

        const promedioLineal = linealOutnumbers.reduce((acc, val) => acc + val, 0) / linealOutnumbers.length;

        return {
          ...item,
          ventas4,
          ventas3,
          ventas2,
          ventas1,
          ventas5,
          ventas6,
          ventas7,
          Clasificación,
          Outlier4,
          Outlier3,
          Outlier2,
          Outlier1,
          Outlier5,
          Outlier6,
          Outlier7, 
          outnumber4,
          outnumber3,
          outnumber2,
          outnumber1,
          outnumber5,
          outnumber6, 
          outnumber7,
          
          linealOutnumber4: linealOutnumbers[0],
          linealOutnumber3: linealOutnumbers[1],
          linealOutnumber2: linealOutnumbers[2],
          linealOutnumber1: linealOutnumbers[3],
          linealOutnumber5: linealOutnumbers[4],
          linealOutnumber6: linealOutnumbers[5],
          linealOutnumber7: linealOutnumbers[6],
          promedioLineal
        };
      })
    );
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos' });
  }
};