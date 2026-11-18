import { NextRequest, NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/server/db";
import { TankerSchedule, WaterAvailabilityLog, AlertNotification } from "@/types";

export async function GET() {
  const db = readDatabase();
  return NextResponse.json({ tankers: db.tankerSchedules });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDatabase();

    const newEntry: TankerSchedule = {
      ...body,
      id: `tnk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    db.tankerSchedules = [newEntry, ...db.tankerSchedules];

    const alert: AlertNotification = {
      id: `alt_${Date.now()}_tnk`,
      societyId: newEntry.societyId,
      title: `Tanker Scheduled: ${newEntry.vendorName}`,
      message: `${newEntry.plannedQuantityLiters.toLocaleString()} L planned for ${newEntry.scheduledTimeWindow} (${newEntry.tankerNumber}).`,
      severity: "info",
      source: "Procurement Dispatch",
      recommendedAction: "Security personnel to verify tanker volume at gate.",
      timestamp: new Date().toISOString(),
      isRead: false,
      actionUrl: "/dashboard/tanker",
    };
    db.alerts = [alert, ...db.alerts];

    writeDatabase(db);
    return NextResponse.json({ success: true, tanker: newEntry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to schedule tanker" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, actualLiters, notes, status } = await req.json();
    const db = readDatabase();
    const target = db.tankerSchedules.find((t) => t.id === id);

    if (!target) {
      return NextResponse.json({ error: "Tanker schedule not found" }, { status: 404 });
    }

    if (actualLiters !== undefined) {
      target.status = "completed";
      target.actualQuantityLiters = actualLiters;
      target.actualArrivalTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      target.confirmedBy = "Vikram Sethi (Admin Verified)";
      target.notes = notes || target.notes;

      // Automatically add to water availability log & increment storage!
      const walEntry: WaterAvailabilityLog = {
        id: `wal_tnk_${Date.now()}`,
        societyId: target.societyId,
        date: new Date().toISOString().split("T")[0],
        time: target.actualArrivalTime,
        source: "tanker",
        quantityLiters: actualLiters,
        durationMinutes: 45,
        storageTankName: "Underground Sump 2 (Auxiliary Buffer)",
        shortageStatus: "adequate",
        notes: `Gate delivery verified: ${target.vendorName} (${target.tankerNumber}). ${notes || ""}`,
        submittedBy: "Verified Gate Flowmeter",
        submitterRole: "admin",
        createdAt: new Date().toISOString(),
        isSensorVerified: true,
      };
      db.availabilityLogs = [walEntry, ...db.availabilityLogs];
      db.currentStorageLiters = Math.min(240000, (db.currentStorageLiters || 142500) + actualLiters);

      const alert: AlertNotification = {
        id: `alt_${Date.now()}_tnk_conf`,
        societyId: target.societyId,
        title: `Tanker Delivery Verified: +${actualLiters.toLocaleString()} L`,
        message: `Delivery from ${target.vendorName} confirmed by gate flowmeter. Added to Underground Sump 2.`,
        severity: "success",
        source: "Gate Flowmeter Verification",
        recommendedAction: "Inspect auxiliary sump balance and water quality.",
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: "/dashboard/tanker",
      };
      db.alerts = [alert, ...db.alerts];
    } else if (status) {
      target.status = status;
    }

    writeDatabase(db);
    return NextResponse.json({ success: true, tanker: target, currentStorageLiters: db.currentStorageLiters }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update tanker" }, { status: 500 });
  }
}
