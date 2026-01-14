import React, { useMemo } from "react";
import { Table } from "react-bootstrap";
import styles from "../../assets/css/sales-transportation-fee.module.css";

type TransportationRow = {
  municipio: string;
  estado: string;
  kmAprox: number; // distancia aproximada desde Cuautlancingo (centro), en km (ida)
};

const MXN_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

// Reglas de negocio / supuestos de cálculo (ajustables)
const FREE_UNDER_KM = 0; // si la distancia (ida) es menor a esto, el servicio es gratis
const AVG_SPEED_KMH = 40; // velocidad promedio para estimar tiempo (urbano/mixto)
const DRIVER_COST_PER_HOUR_MXN = 200; // costo por hora del conductor (MXN)
const TIME_MULTIPLIER = 2; // multiplicador por tiempo (ej. 1.2 por demanda/horario)
const TOP_N = 25; // mostrar solo el "top" (más cercanos). Ajusta a 25 si quieres ver todos.

function estimateGasCostRangeMxn(kmOneWay: number) {
  // Supuestos simples para dar una idea (no es tarifa final):
  // - rendimiento promedio: 12 km/L
  // - gasolina regular aprox: $24 MXN/L
  const kmPerLiter = 12;
  const pricePerLiter = 24;
  const base = (kmOneWay / kmPerLiter) * pricePerLiter;
  // variación por tráfico/ruta/vehículo
  const min = base * 0.85;
  const max = base * 1.25;
  return {
    min,
    max,
    base,
  };
}

function roundToMultiple(value: number, multiple: number) {
  if (!Number.isFinite(value)) return value;
  return Math.round(value / multiple) * multiple;
}

function estimateServiceCostRangeMxn(kmOneWay: number) {
  if (kmOneWay <= FREE_UNDER_KM) {
    return { isFree: true as const, min: 0, max: 0 };
  }

  const gas = estimateGasCostRangeMxn(kmOneWay);
  const tripHours = kmOneWay / AVG_SPEED_KMH;
  const driverBase = tripHours * DRIVER_COST_PER_HOUR_MXN * TIME_MULTIPLIER;
  // mismo rango porcentual para cubrir variación real (tráfico/ruta/tiempos)
  const rawMin = (gas.base + driverBase) * 0.85;
  const rawMax = (gas.base + driverBase) * 1.25;
  const minRounded = roundToMultiple(rawMin, 50);
  const maxRounded = roundToMultiple(rawMax, 50);
  const min = Math.min(minRounded, maxRounded);
  const max = Math.max(minRounded, maxRounded);

  return { isFree: false as const, min, max };
}

export const TransportationFee = () => {
  const rows: TransportationRow[] = useMemo(
    () =>
      [
        { municipio: "Coronango", estado: "Puebla", kmAprox: 6 },
        { municipio: "San Miguel Xoxtla", estado: "Puebla", kmAprox: 7 },
        { municipio: "San Pedro Cholula", estado: "Puebla", kmAprox: 8 },
        { municipio: "San Andrés Cholula", estado: "Puebla", kmAprox: 10 },
        { municipio: "Juan C. Bonilla", estado: "Puebla", kmAprox: 11 },
        { municipio: "Puebla", estado: "Puebla", kmAprox: 12 },
        { municipio: "San Gregorio Atzompa", estado: "Puebla", kmAprox: 13 },
        { municipio: "Santa Isabel Cholula", estado: "Puebla", kmAprox: 16 },
        { municipio: "Huejotzingo", estado: "Puebla", kmAprox: 18 },
        { municipio: "Amozoc", estado: "Puebla", kmAprox: 24 },
        { municipio: "San Pablo del Monte", estado: "Tlaxcala", kmAprox: 26 },
        { municipio: "Ocoyucan", estado: "Puebla", kmAprox: 26 },
        { municipio: "San Martín Texmelucan", estado: "Puebla", kmAprox: 28 },
        {
          municipio: "Papalotla de Xicohténcatl",
          estado: "Tlaxcala",
          kmAprox: 28,
        },
        { municipio: "Nealtican", estado: "Puebla", kmAprox: 30 },
        { municipio: "Chiautzingo", estado: "Puebla", kmAprox: 32 },
        { municipio: "Calpan", estado: "Puebla", kmAprox: 32 },
        { municipio: "Atlixco", estado: "Puebla", kmAprox: 35 },
        { municipio: "San Salvador el Verde", estado: "Puebla", kmAprox: 36 },
        { municipio: "Domingo Arenas", estado: "Puebla", kmAprox: 38 },
        { municipio: "San Felipe Teotlalcingo", estado: "Puebla", kmAprox: 40 },
        { municipio: "Cuautinchán", estado: "Puebla", kmAprox: 40 },
        {
          municipio: "San Nicolás de los Ranchos",
          estado: "Puebla",
          kmAprox: 45,
        },
        { municipio: "San Jerónimo Tecuanipan", estado: "Puebla", kmAprox: 46 },
        { municipio: "Santa Rita Tlahuapan", estado: "Puebla", kmAprox: 52 },
      ].sort((a, b) => a.kmAprox - b.kmAprox),
    []
  );

  const topRows = useMemo(() => rows.slice(0, TOP_N), [rows]);

  return (
    <div className={styles.transportationFeeContainer}>
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between flex-wrap ">
            <div>
              <h3 className="mb-1">Tarifa de traslado (referencia)</h3>
              <p className="text-muted">
                200 Pesos de descuento por exposición a bodas y quince años
              </p>
            </div>
          </div>

          <div className={`mt-3 ${styles.tableWrap}`}>
            <Table responsive="lg" bordered hover className="mb-0">
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Municipio</th>
                  <th style={{ width: "40%" }}>Costo aprox. servicio mxn</th>
                </tr>
              </thead>
              <tbody>
                {topRows.map((r) => {
                  const cost = estimateServiceCostRangeMxn(r.kmAprox);
                  return (
                    <tr key={`${r.municipio}-${r.estado}`}>
                      <td>
                        <div className="fw-semibold">
                          {r.municipio}, {r.estado}
                        </div>
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          Distancia aprox: {r.kmAprox} km (ida)
                        </div>
                      </td>
                      <td className="fw-semibold">
                        {cost.isFree
                          ? "Gratis"
                          : `${MXN_FORMAT.format(cost.max)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
