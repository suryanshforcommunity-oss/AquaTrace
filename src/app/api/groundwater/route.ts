import { NextRequest, NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/server/db";
import { GroundwaterReading, AlertNotification } from "@/types";

export async function GET() {
  const db = readDatabase();
  return NextResponse.json({
    borewells: db.borewellPoints,
    readings: db.groundwaterReadings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDatabase();

    const newEntry: GroundwaterReading = {
      ...body,
      id: `gwr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    db.groundwaterReadings = [newEntry, ...db.groundwaterReadings];

    // Update matching borewell current depth
    db.borewellPoints = db.borewellPoints.map((bw) =>
      bw.id === newEntry.borewellId
        ? { ...bw, currentDepthMeters: newEntry.depthMeters, swlMeters: newEntry.depthMeters }
        : bw
    );

    // If depth dropped past 18m, trigger caution alert
    if (newEntry.depthMeters >= 18.0) {
      const alert: AlertNotification = {
        id: `alt_${Date.now()}_gw_warn`,
        societyId: newEntry.societyId,
        title: `Borewell Depth Caution: ${newEntry.depthMeters}m Below Datum`,
        message: `Static water level in Borewell has dropped to ${newEntry.depthMeters}m. Submersible pump rest cycle recommended.`,
        severity: newEntry.depthMeters >= 20 ? "danger" : "warning",
        source: "Hydrological Piezometer Sensor",
        timestamp: new Date().toISOString(),
        isRead: false,
        recommendedAction: "Activate alternating resting cycle and switch load to municipal storage.",
        actionUrl: "/dashboard/groundwater",
      };
      db.alerts = [alert, ...db.alerts];
    }

    writeDatabase(db);
    return NextResponse.json({ success: true, reading: newEntry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log groundwater reading" }, { status: 500 });
  }
}
