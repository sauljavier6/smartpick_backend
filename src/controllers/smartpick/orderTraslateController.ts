// src/controllers/smartpick/orderTraslateController.ts
import { Op } from "sequelize";
import Order from "../../models/smartpick/Order";
import Orderdep from "../../models/smartpick/OrderDep";
import Orderitem from "../../models/smartpick/OrderItem";
import { getOrdersItems, getOrdersTraslate, getOrderTraslate } from "../../services/smartpick/OrderTraslate.service";
import PDFDocument from "pdfkit";
import { Request, Response } from "express";
import sequelize from "../../config/database";
import ExcelJS from "exceljs";

export const getData = async (req: any, res: any) => {
  try {
    const idEstado = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const allOrders = await getOrdersTraslate(idEstado);

    const totalItems = allOrders.length;
    const totalPages = Math.ceil(totalItems / limit);

    const data = allOrders.slice(offset, offset + limit);

    res.status(200).json({
      data,
      currentPage: page,
      totalPages,
      totalItems,
      hasMore: page < totalPages,
      message: 'Órdenes de traslado obtenidas correctamente',
    });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};


export const getDatawithItems = async (req: any, res: any) => {
  const { id, idpicker } = req.params;
  const t = await sequelize.transaction();
  try {
    

    let data = await Order.findOne({
      where: { tranid: id, State: true },
      transaction: t
    });

    let items;
    let departamento;

    if (data) {
      console.log('los datos fueron obtenidos desde la bd postgre')
      items = await Orderitem.findAll({ where: { tranid: id, State: true }, transaction: t });
      departamento = await Orderdep.findAll({ 
        where: { 
          tranid: id,
          Completed: false,
          State: true,
          [Op.or]: [
            { idpicker: null },
            { idpicker: idpicker }
          ]
        },
        transaction: t
      });
    }

    if (!data) {
      console.log('los datos fueron obtenidos desde la bd sql server')
      const order = await getOrderTraslate(id);

      data = await Order.create({
        tranid: order.tranid,
        trandate: order.trandate,
        transferlocation: order.transferlocation,
        useitemcostastransfercost: order.useitemcostastransfercost,
        firmed: order.firmed,
        Completed: false,
        State: true
      }, { transaction: t });

      const itemsdata = await getOrdersItems(id);
      //departamento 

      items = await Orderitem.bulkCreate(
        itemsdata.map((item) => ({
          item: item.item,
          itemid: item.itemid,
          tranid: order.tranid,
          memo: item.memo,
          upccode: item.upccode ?? "",
          categoria: item.categoria,
          departamento: item.departamento,
          iddepartamento: item.iddepartamento,
          quantity: item.quantity,
          line: item.line,
          custitem_nso_codigo_citadel: item.custitem_nso_codigo_citadel,
        })),
        { transaction: t }
      );

      const depdata = Array.from(
        new Map(
          itemsdata.map((dep) => [
            dep.iddepartamento,
            { iddepartamento: dep.iddepartamento, departamento: dep.departamento }
          ])
        ).values()
      );

      departamento = await Orderdep.bulkCreate(
        depdata.map((dep) => ({    
          iddepartamento: dep.iddepartamento,
          departamento: dep.departamento,
          tranid: order.tranid,
          idpicker: null,
          Completed: false,
          State: true
        })),
        { transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({ data, departamento });
  } catch (error) {
    await t.rollback();
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};



export const updateOrderDep = async (req: any, res: any) => {
    const { id, idpicker, tranid } = req.params;

  try {

    const dep = await Orderdep.findOne({ where: { iddepartamento: id , tranid: tranid, Completed: false, State: true }});

    if (!dep) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    dep.idpicker = idpicker;
    await dep.save();

    const items = await Orderitem.findAll({where: {tranid: tranid , iddepartamento: id, State: true} })

    res.status(200).json({
      message: "Departamento asignado correctamente",
      dep,
      items
    });
  } catch (error) {
    console.error("Error al actualizar departamento:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};


export const getmyorders = async (req: any, res: any) => {
  const { idpicker } = req.params;

  try {
    const dep = await Orderdep.findAll({ where: { idpicker } });

    if (!dep || dep.length === 0) {
      return res.status(404).json({ message: "Departamentos no encontrados" });
    }

    const tranIds = dep.map(d => d.tranid);

    const data = await Order.findAndCountAll({
      where: { tranid: tranIds, Completed: true }
    });

    const latestOrders = await Order.findAll({
      where: { tranid: tranIds, Completed: true },
      order: [['trandate', 'DESC']], 
      limit: 5
    });

    const enProceso = await Order.count({
      where: {
        tranid: tranIds,
        Completed: false,
        State: true
      }
    });

    const datadeppend = await Orderdep.findAndCountAll({
      where: { tranid: tranIds, idpicker: idpicker, Completed: false, State: true }
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const ordersasigned = await Order.findAndCountAll({
      where: { 
        State: true,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    res.status(200).json({
      message: "Success",
      orderCompleted: data.count,
      latestOrders,
      deppendientes: datadeppend.count,
      ordasignadas: ordersasigned.count,
      enProceso
    });
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};


export const getorderbyid = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    let dep 

    dep = await Order.findByPk(id);
    if(!dep){
      dep = await getOrderTraslate(id);
    }

    if (!dep) {
     dep: "Orden no encontrada"
    }

    res.status(200).json({
     dep
    });
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};


export const completedOrder = async (req: any, res: any) => {
  const { id, idpicker, tranid } = req.params;
  const { items } = req.body;

  try {
    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: "El body debe contener un array 'items' con los productos a actualizar",
      });
    }

    for (const item of items) {
      const orderItem = await Orderitem.findOne({
        where: { item: item.item, tranid: tranid }
      });
      if (orderItem) {
        if (orderItem.quantity !== item.quantity) {
          orderItem.quantity = item.quantity;
          await orderItem.save();
          console.log(`✔ Item ${item.item} actualizado con quantity=${item.quantity}`);
        }
      } else {
        console.warn(`⚠ Item con id ${item.item} no encontrado`);
      }
    }


    let dep = await Orderdep.findOne({
      where: {
        iddepartamento: id,
        tranid: tranid,
        idpicker: idpicker
      }
    });

    if (!dep) {
      dep = await getOrderTraslate(tranid);
    }

    if (!dep) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    dep.Completed = true;
    dep.idpicker = idpicker;
    await dep.save();
    console.log(`✔ Departamento ${id} marcado como Completed`);

    const departamentos = await Orderdep.findAll({ where: { tranid } });
    const allCompleted = departamentos.every((d) => d.Completed === true);

    if (allCompleted) {
      const order = await Order.findOne({ where: { tranid } });
      if (order) {
        order.Completed = true;
        await order.save();
        console.log(`🎉 Orden ${tranid} completada`);
      }
    }

    return res.status(200).json({
      message: "Departamento completado correctamente",
      dep,
      allCompleted,
    });
  } catch (error) {
    console.error("❌ Error al completar departamento:", error);
    return res.status(500).json({ message: "Error en el servidor", error });
  }
};


export const printOrder = async (req: Request, res: Response) => {
  const { tranid } = req.params;
  const orden = await Order.findOne({
    where: { tranid, State: true }
  });
  if (!orden) return res.status(404).json({ message: "Orden no encontrada" });

  const items = await Orderitem.findAll({
    where: { tranid, State: true }
  });

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=orden_${tranid}.pdf`);
  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, 80).fill("#f3f4f6");
  doc.fillColor("#000").font('Helvetica-Bold').fontSize(20).text(`Orden de Traslado #${orden.tranid}`, 50, 30);
  doc.font('Helvetica').fontSize(12).text(`Fecha: ${orden.trandate.toLocaleDateString()}`, 50, 55);
  doc.text(`Sucursal: ${orden?.transferlocation}`, 300, 55);

  doc.moveDown(3);

  const tableTop = 100;
  const itemX = 50;
  const quantityX = 340;
  const locationX = 410;

  doc.font('Helvetica-Bold').fontSize(10).fillColor("#000").text("Producto", itemX, tableTop);
  doc.text("Cantidad", quantityX, tableTop);
  doc.text("Departamento", locationX, tableTop);

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  let y = tableTop + 25;
  items.forEach((item, index) => {
    doc.font('Helvetica').fontSize(8).fillColor("#000").text(item.memo, itemX, y);
    doc.text(item.quantity.toString(), quantityX, y);
    doc.text(item.departamento, locationX, y);
    y += 20;

    doc.moveTo(50, y - 5).lineTo(550, y - 5).strokeOpacity(0.1).stroke();
  });

  doc.fontSize(10).fillColor("#555").text(`Total de productos: ${items.length}`, 50, y + 20);

  doc.end();
};



export const exportOrderExcel = async (req: Request, res: Response) => {
  try {
    const { tranid } = req.params;

    const orden = await Order.findOne({
      where: { tranid, State: true },
    });
    if (!orden) return res.status(404).json({ message: "Orden no encontrada" });

    const items = await Orderitem.findAll({
      where: { tranid, State: true },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orden de Traslado");

    worksheet.columns = [
      { header: "External_ID", key: "External_ID", width: 10 },
      { header: "Created_From", key: "Created_From", width: 20 },
      { header: "Item", key: "Item", width: 10 },
      { header: "Quantity", key: "Quantity", width: 10 },
      { header: "Location", key: "Location", width: 10 },
      { header: "Ship_Date", key: "Ship_Date", width: 10 },
      { header: "line", key: "line", width: 10 },
    ];

    items.forEach((item) => {
      worksheet.addRow({
        External_ID: item.tranid,
        Created_From: 'Orden de traslado #' + orden.tranid,
        Item: item.itemid,
        Quantity: item.quantity,
        Location: orden.transferlocation,
        Ship_Date: orden.trandate.toLocaleDateString("en-US"),
        line: item.line,  
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ot-${tranid}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("❌ Error al generar Excel:", error);
    res.status(500).send("Error generando Excel");
  }
};