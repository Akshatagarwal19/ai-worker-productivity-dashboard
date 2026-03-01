import db from "../db.js";

function calculateDuration(start, end) {
  return (new Date(end) - new Date(start)) / 1000; // seconds
}

export function getWorkerMetrics() {
  const workers = db.prepare("SELECT * FROM workers").all();
  const allEvents = db
    .prepare(
      `
    SELECT * FROM events ORDER BY timestamp ASC
  `,
    )
    .all();

  const result = [];

  workers.forEach((worker) => {
    const events = allEvents.filter((e) => e.worker_id === worker.worker_id);

    let activeTime = 0;
    let idleTime = 0;
    let totalUnits = 0;

    for (let i = 0; i < events.length - 1; i++) {
      const current = events[i];
      const next = events[i + 1];

      const duration = calculateDuration(current.timestamp, next.timestamp);

      if (current.event_type === "working") {
        activeTime += duration;
      }

      if (current.event_type === "idle") {
        idleTime += duration;
      }

      if (current.event_type === "product_count") {
        totalUnits += current.count || 0;
      }
    }

    const totalTime = activeTime + idleTime;
    const utilization = totalTime > 0 ? (activeTime / totalTime) * 100 : 0;
    const unitsPerHour = activeTime > 0 ? totalUnits / (activeTime / 3600) : 0;

    result.push({
      worker_id: worker.worker_id,
      name: worker.name,
      activeTime,
      idleTime,
      utilization: utilization.toFixed(2),
      totalUnits,
      unitsPerHour: unitsPerHour.toFixed(2),
    });
  });

  return result;
}
export function getWorkstationMetrics() {
  const stations = db.prepare("SELECT * FROM workstations").all();
  const allEvents = db
    .prepare(
      `
    SELECT * FROM events ORDER BY timestamp ASC
  `,
    )
    .all();

  const result = [];

  stations.forEach((station) => {
    const events = allEvents.filter(
      (e) => e.workstation_id === station.station_id,
    );

    let occupancyTime = 0;
    let totalUnits = 0;

    for (let i = 0; i < events.length - 1; i++) {
      const current = events[i];
      const next = events[i + 1];

      const duration = calculateDuration(current.timestamp, next.timestamp);

      if (current.event_type === "working") {
        occupancyTime += duration;
      }

      if (current.event_type === "product_count") {
        totalUnits += current.count || 0;
      }
    }

    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      const assumedEnd = new Date(
        new Date(lastEvent.timestamp).getTime() + 5 * 60 * 1000,
      );

      const duration = calculateDuration(
        lastEvent.timestamp,
        assumedEnd.toISOString(),
      );

      if (lastEvent.event_type === "working") {
        occupancyTime += duration;
      }

      if (lastEvent.event_type === "product_count") {
        totalUnits += lastEvent.count || 0;
      }
    }
    const totalTime = occupancyTime;
    const utilization = totalTime > 0 ? 100 : 0;
    const throughputRate =
      occupancyTime > 0 ? totalUnits / (occupancyTime / 3600) : 0;

    result.push({
      station_id: station.station_id,
      name: station.name,
      occupancyTime,
      utilization: utilization.toFixed(2),
      totalUnits,
      throughputRate: throughputRate.toFixed(2),
    });
  });

  return result;
}
export function getFactoryMetrics() {
  const workerMetrics = getWorkerMetrics();

  let totalProductiveTime = 0;
  let totalProduction = 0;
  let totalUtilization = 0;

  workerMetrics.forEach((w) => {
    totalProductiveTime += w.activeTime;
    totalProduction += w.totalUnits;
    totalUtilization += parseFloat(w.utilization);
  });

  const avgUtilization =
    workerMetrics.length > 0 ? totalUtilization / workerMetrics.length : 0;

  const avgProductionRate =
    totalProductiveTime > 0
      ? totalProduction / (totalProductiveTime / 3600)
      : 0;

  return {
    totalProductiveTime,
    totalProduction,
    avgUtilization: avgUtilization.toFixed(2),
    avgProductionRate: avgProductionRate.toFixed(2),
  };
}
