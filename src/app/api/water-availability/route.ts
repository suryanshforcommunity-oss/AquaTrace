import { NextRequest, NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/server/db";
import { WaterAvailabilityLog, AlertNotification } from "@/types";

export async function GET() {
  const db = readDatabase();
  return NextResponse.json({
    logs: db.availabilityLogs,
    currentStorageLiters: db.currentStorageLiters,
    totalCount: db.availabilityLogs.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDatabase();

    const newEntry: WaterAvailabilityLog = {
      ...body,
      id: `wal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };

    db.availabilityLogs = [newEntry, ...db.availabilityLogs];
    db.currentStorageLiters = Math.min(240000, (db.currentStorageLiters || 142500) + (Number(newEntry.quantityLiters) || 0));

    const alert: AlertNotification = {
      id: `alt_${Date.now()}_wal`,
      societyId: newEntry.societyId,
      title: `Water Availability Logged: +${newEntry.quantityLiters.toLocaleString()} L`,
      message: `${newEntry.source.toUpperCase()} supply recorded into ${newEntry.storageTankName} by ${newEntry.submittedBy}. Storage updated.`,
      severity: newEntry.shortageStatus === "low" || newEntry.shortageStatus === "critical" ? "warning" : "info",
      source: "Intake Flow Telemetry",
      timestamp: new Date().toISOString(),
      isRead: false,
      recommendedAction: "Monitor sump balance and distribution valve schedules.",
      actionUrl: "/dashboard/water-availability",
    };
    db.alerts = [alert, ...db.alerts];

    writeDatabase(db);
    return NextResponse.json({ success: true, log: newEntry, currentStorageLiters: db.currentStorageLiters }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add availability log" }, { status: 500 });
  }
}
