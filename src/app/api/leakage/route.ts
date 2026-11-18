import { NextRequest, NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/server/db";
import { LeakageReport, AlertNotification } from "@/types";

export async function GET() {
  const db = readDatabase();
  return NextResponse.json({ leakageReports: db.leakageReports });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDatabase();

    const newEntry: LeakageReport = {
      ...body,
      id: `leak_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      status: "submitted",
    };
    db.leakageReports = [newEntry, ...db.leakageReports];

    const alert: AlertNotification = {
      id: `alt_${Date.now()}_leak`,
      societyId: newEntry.societyId,
      title: `Urgent Leakage Reported: ${newEntry.title}`,
      message: `${newEntry.locationDetails} · Urgency: ${newEntry.urgency.toUpperCase()}. Reported by ${newEntry.submittedBy}.`,
      severity: newEntry.urgency === "critical" || newEntry.urgency === "high" ? "danger" : "warning",
      source: "Resident Field Report",
      timestamp: new Date().toISOString(),
      isRead: false,
      recommendedAction: "Dispatch maintenance plumbing crew to isolate distribution riser.",
      actionUrl: "/dashboard/leakage",
    };
    db.alerts = [alert, ...db.alerts];

    writeDatabase(db);
    return NextResponse.json({ success: true, report: newEntry, alert }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit leakage report" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, technician, notes, action, channel } = await req.json();
    const db = readDatabase();
    const target = db.leakageReports.find((r) => r.id === id);

    if (!target) {
      return NextResponse.json({ error: "Leakage report not found" }, { status: 404 });
    }

    if (action === "forward") {
      const refNum = `BWSSB-ESC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      target.status = "forwarded";
      target.forwardedUtilityChannel = channel || "BWSSB Official Portal";
      target.utilityReferenceNumber = refNum;
      target.forwardedTimestamp = new Date().toISOString();

      const alert: AlertNotification = {
        id: `alt_${Date.now()}_utility_esc`,
        societyId: db.selectedSocietyId,
        title: `Docket Escalated to Public Utility: Ref #${refNum}`,
        message: `Leakage docket officially registered on ${target.forwardedUtilityChannel}.`,
        severity: "info",
        source: "Public Utility Gateway",
        recommendedAction: "Track municipal docket resolution.",
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: "/dashboard/leakage",
      };
      db.alerts = [alert, ...db.alerts];
    } else {
      if (status) target.status = status;
      if (technician) target.assignedTechnician = technician;
      if (notes) target.resolutionNotes = notes;
      if (status === "resolved") {
        target.resolutionTimestamp = new Date().toISOString();
        const alert: AlertNotification = {
          id: `alt_${Date.now()}_leak_res`,
          societyId: db.selectedSocietyId,
          title: `Leakage Resolved & Verified`,
          message: `Plumbing issue #${id} repaired by ${technician || "Maintenance"} and tested for line integrity.`,
          severity: "success",
          source: "Technician Dispatch Desk",
          recommendedAction: "Archive resolved complaint.",
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: "/dashboard/leakage",
        };
        db.alerts = [alert, ...db.alerts];
      }
    }

    writeDatabase(db);
    return NextResponse.json({ success: true, report: target }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update leakage report" }, { status: 500 });
  }
}
