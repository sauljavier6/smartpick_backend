import { SerialPort } from 'serialport';

SerialPort.list().then(ports => console.log(ports));

function buildLabel(code: string, desc: string) {
  return `
! 0 200 200 320 1
CENTER
TEXT 4 0 0 20 ${desc}
BARCODE 128 1 1 60 0 80 ${code}
PRINT
  `;
}

export async function printLabelBluetooth(portName: string, code: string, desc: string) {
  return new Promise((resolve, reject) => {
    const port = new SerialPort({
      path: portName,
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      xon: true,
      xoff: true
    });

    const label = buildLabel(code, desc);

    port.write(label, (err) => {
      if (err) return reject(err);
      port.drain(() => {
        port.close();
        resolve("Impreso por Bluetooth");
      });
    });
  });
}



async function findPrinterPort() {
  const ports = await SerialPort.list();
  
  // filtra usando manufacturer o pnpId
  const printer = ports.find(p =>
    (p.manufacturer && p.manufacturer.includes("Microsoft")) &&
    (p.pnpId && p.pnpId.includes("BTHENUM"))
  );

  if (!printer) throw new Error("No se encontró la impresora");
  return printer.path;
}



export const toPrint = async (req: any, res: any) => {
  const { code, desc } = req.body;
  try {
    const portName = await findPrinterPort();
    await printLabelBluetooth(portName, code, desc);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err });
  }
};

