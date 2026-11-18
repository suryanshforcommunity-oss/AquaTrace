import { NextRequest, NextResponse } from "next/server";
import { readDatabase, writeDatabase, resetDatabase, DatabaseSchema } from "@/lib/server/db";
import {
  WaterAvailabilityLog,
  TankerSchedule,
  GroundwaterReading,
  RainwaterHarvestingUnit,
  MaintenanceChecklistLog,
  LeakageReport,
  WaterSavingLog,
  ForumPost,
  AlertNotification,
  WaterQualityReading,
} from "@/types";

export async function GET(req: NextRequest) {
  try {
    const db = readDatabase();
    return NextResponse.json(db, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to read database" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { action, data } = payload;

    if (!action) {
      return NextResponse.json({ error: "Missing action in request payload" }, { status: 400 });
    }

    const db = readDatabase();
    let responseData: any = null;

    switch (action) {
      case "add_availability_log": {
        const newEntry: WaterAvailabilityLog = {
          ...data,
          id: `wal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          createdAt: new Date().toISOString(),
        };
        db.availabilityLogs = [newEntry, ...db.availabilityLogs];
        // Increment stored usable water
        db.currentStorageLiters = Math.min(
          240000,
          (db.currentStorageLiters || 142500) + (Number(newEntry.quantityLiters) || 0)
        );

        // Automatic Alert Notification
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
        responseData = { entry: newEntry, alert, currentStorageLiters: db.currentStorageLiters };
        break;
      }

      case "add_tanker": {
        const newEntry: TankerSchedule = {
          ...data,
          id: `tnk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        };
        db.tankerSchedules = [newEntry, ...db.tankerSchedules];

        const alert: AlertNotification = {
          id: `alt_${Date.now()}_tnk`,
          societyId: newEntry.societyId,
          title: `Tanker Scheduled: ${newEntry.vendorName}`,
          message: `${newEntry.plannedQuantityLiters.toLocaleString()} L planned for arrival during ${newEntry.scheduledTimeWindow} (${newEntry.tankerNumber}).`,
          severity: "info",
          source: "Procurement Dispatch",
          recommendedAction: "Security personnel to verify tanker volume at gate.",
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: "/dashboard/tanker",
        };
        db.alerts = [alert, ...db.alerts];
        responseData = { entry: newEntry, alert };
        break;
      }

      case "confirm_tanker": {
        const { id, actualLiters, notes } = data;
        const target = db.tankerSchedules.find((t) => t.id === id);
        if (target) {
          target.status = "completed";
          target.actualQuantityLiters = actualLiters;
          target.actualArrivalTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
          target.confirmedBy = "Vikram Sethi (Admin Verified)";
          target.notes = notes || target.notes;

          // Also automatically append to water availability log!
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
            notes: `Gate arrival verified for ${target.vendorName} (${target.tankerNumber}). ${notes || ""}`,
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
            title: `Tanker Delivery Verified: +${actualLiters.toLocaleString()} L Received`,
            message: `Delivery from ${target.vendorName} confirmed by security flowmeter. Transferred to Underground Sump 2.`,
            severity: "success",
            source: "Gate Flowmeter Verification",
            recommendedAction: "Monitor auxiliary sump balance and chlorine levels.",
            timestamp: new Date().toISOString(),
            isRead: false,
            actionUrl: "/dashboard/tanker",
          };
          db.alerts = [alert, ...db.alerts];
          responseData = { tanker: target, availabilityLog: walEntry, currentStorageLiters: db.currentStorageLiters };
        }
        break;
      }

      case "add_groundwater": {
        const newEntry: GroundwaterReading = {
          ...data,
          id: `gwr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
        };
        db.groundwaterReadings = [newEntry, ...db.groundwaterReadings];

        // Update borewell current depth
        db.borewellPoints = db.borewellPoints.map((bw) =>
          bw.id === newEntry.borewellId
            ? { ...bw, currentDepthMeters: newEntry.depthMeters, swlMeters: newEntry.depthMeters }
            : bw
        );

        // Check caution threshold (> 18m)
        if (newEntry.depthMeters >= 18.0) {
          const alert: AlertNotification = {
            id: `alt_${Date.now()}_gw_warn`,
            societyId: newEntry.societyId,
            title: `Borewell Depth Caution: ${newEntry.depthMeters}m Below Datum`,
            message: `Static water level in Borewell has dropped past 18m threshold. Rest cycle recommended to protect submersible pump.`,
            severity: newEntry.depthMeters >= 20 ? "danger" : "warning",
            source: "Hydrological Piezometer Matrix",
            timestamp: new Date().toISOString(),
            isRead: false,
            recommendedAction: "Activate alternating resting cycle and switch load to municipal storage.",
            actionUrl: "/dashboard/groundwater",
          };
          db.alerts = [alert, ...db.alerts];
        }
        responseData = { entry: newEntry };
        break;
      }

      case "add_leakage": {
        const newEntry: LeakageReport = {
          ...data,
          id: `leak_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
          status: "submitted",
        };
        db.leakageReports = [newEntry, ...db.leakageReports];

        // High priority alert
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
        responseData = { entry: newEntry, alert };
        break;
      }

      case "update_leakage_status": {
        const { id, status, technician, notes, report } = data;
        let found = false;
        db.leakageReports = db.leakageReports.map((r) => {
          if (r.id === id) {
            found = true;
            return {
              ...r,
              status,
              assignedTechnician: technician || r.assignedTechnician,
              resolutionTimestamp: status === "resolved" ? new Date().toISOString() : r.resolutionTimestamp,
              resolutionNotes: notes || r.resolutionNotes,
            };
          }
          return r;
        });

        if (!found && report) {
          db.leakageReports = [report, ...db.leakageReports];
        }

        if (status === "resolved") {
          const alert: AlertNotification = {
            id: `alt_${Date.now()}_leak_res`,
            societyId: db.selectedSocietyId,
            title: `Leakage Resolved & Verified`,
            message: `Plumbing issue #${id} has been repaired by ${technician || "Maintenance"} and tested for line integrity.`,
            severity: "success",
            source: "Technician Dispatch Desk",
            recommendedAction: "Close work ticket and archive report.",
            timestamp: new Date().toISOString(),
            isRead: false,
            actionUrl: "/dashboard/leakage",
          };
          db.alerts = [alert, ...db.alerts];
        }
        responseData = { success: true };
        break;
      }

      case "forward_leakage": {
        const { id, channel = "BWSSB Official Portal" } = data;
        const refNum = `BWSSB-ESC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        db.leakageReports = db.leakageReports.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "forwarded" as const,
                forwardedUtilityChannel: channel,
                utilityReferenceNumber: refNum,
                forwardedTimestamp: new Date().toISOString(),
              }
            : r
        );

        const alert: AlertNotification = {
          id: `alt_${Date.now()}_utility_esc`,
          societyId: db.selectedSocietyId,
          title: `Docket Escalated to Public Utility: Ref #${refNum}`,
          message: `Leakage docket officially registered on ${channel}. Awaiting AEE inspection dispatch.`,
          severity: "info",
          source: "Public Utility Municipal Gateway",
          recommendedAction: "Monitor docket resolution status with municipal department.",
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: "/dashboard/leakage",
        };
        db.alerts = [alert, ...db.alerts];
        responseData = { referenceNumber: refNum };
        break;
      }

      case "add_rwh_unit": {
        const newEntry: RainwaterHarvestingUnit = {
          ...data,
          id: `rwh_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        };
        db.rwhUnits = [...db.rwhUnits, newEntry];
        responseData = { entry: newEntry };
        break;
      }

      case "add_maintenance_log": {
        const newEntry: MaintenanceChecklistLog = {
          ...data,
          id: `mnt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        };
        db.maintenanceLogs = [newEntry, ...db.maintenanceLogs];
        // Update parent unit status
        db.rwhUnits = db.rwhUnits.map((u) =>
          u.id === newEntry.unitId
            ? {
                ...u,
                lastInspectionDate: newEntry.inspectionDate,
                status: newEntry.overallStatus === "passed" ? "optimal" : "maintenance_due",
              }
            : u
        );

        const alert: AlertNotification = {
          id: `alt_${Date.now()}_rwh_mnt`,
          societyId: newEntry.societyId,
          title: `RWH Maintenance Logged: ${newEntry.overallStatus.toUpperCase()}`,
          message: `Checklist recorded by ${newEntry.inspectorName}. Gutters & first-flush inspected.`,
          severity: newEntry.overallStatus === "passed" ? "success" : "warning",
          source: "RWH Maintenance Ledger",
          recommendedAction: "Review annual filtration maintenance schedule.",
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: "/dashboard/rainwater",
        };
        db.alerts = [alert, ...db.alerts];
        responseData = { entry: newEntry };
        break;
      }

      case "add_water_saving": {
        const newEntry: WaterSavingLog = {
          ...data,
          id: `wsl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
        };
        db.waterSavingLogs = [newEntry, ...db.waterSavingLogs];

        const alert: AlertNotification = {
          id: `alt_${Date.now()}_wsl`,
          societyId: newEntry.societyId,
          title: `Community Water Saving: +${(newEntry.measuredLitersSaved || newEntry.estimatedLitersSaved).toLocaleString()} L Saved`,
          message: `${newEntry.residentName} (${newEntry.apartmentUnit}) logged water saving: ${newEntry.activityTitle}.`,
          severity: "success",
          source: "Conservation Hub",
          recommendedAction: "View community leaderboard standings.",
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: "/dashboard/conservation",
        };
        db.alerts = [alert, ...db.alerts];
        responseData = { entry: newEntry };
        break;
      }

      case "verify_water_saving": {
        const { id, adminName } = data;
        db.waterSavingLogs = db.waterSavingLogs.map((s) =>
          s.id === id ? { ...s, isVerifiedByAdmin: true, verifiedBy: adminName } : s
        );
        responseData = { success: true };
        break;
      }

      case "add_forum_post": {
        const newEntry: ForumPost = {
          ...data,
          id: `fp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
          upvotes: 1,
          repliesCount: 0,
        };
        db.forumPosts = [newEntry, ...db.forumPosts];
        responseData = { entry: newEntry };
        break;
      }

      case "upvote_post": {
        const { id } = data;
        db.forumPosts = db.forumPosts.map((p) =>
          p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
        );
        responseData = { success: true };
        break;
      }

      case "add_water_quality": {
        const newEntry: WaterQualityReading = {
          ...data,
          id: `wq_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
        };
        db.waterQualityReadings = [newEntry, ...db.waterQualityReadings];
        responseData = { entry: newEntry };
        break;
      }

      case "trigger_alert": {
        const newEntry: AlertNotification = {
          ...data,
          id: `alt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        db.alerts = [newEntry, ...db.alerts];
        responseData = { alert: newEntry };
        break;
      }

      case "mark_alert_read": {
        const { id } = data;
        if (id === "all") {
          db.alerts = db.alerts.map((a) => ({ ...a, isRead: true }));
        } else {
          db.alerts = db.alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a));
        }
        responseData = { success: true };
        break;
      }

      case "dismiss_alert": {
        const { id } = data;
        db.alerts = db.alerts.filter((a) => a.id !== id);
        responseData = { success: true };
        break;
      }

      case "toggle_emergency": {
        db.isEmergencyCutoffActive = !db.isEmergencyCutoffActive;
        const alert: AlertNotification = {
          id: `alt_${Date.now()}_emg`,
          societyId: db.selectedSocietyId,
          title: db.isEmergencyCutoffActive ? "EMERGENCY MAIN VALVE CUTOFF ENGAGED" : "Emergency Main Valve Re-opened",
          message: db.isEmergencyCutoffActive
            ? "All motorized outflow valves to Basement and Tower distribution lines have been isolated by Administrator."
            : "Motorized gate valves restored to standard telemetry control.",
          severity: db.isEmergencyCutoffActive ? "danger" : "info",
          source: "Manual Safety Interlock",
          timestamp: new Date().toISOString(),
          isRead: false,
          recommendedAction: db.isEmergencyCutoffActive ? "Inspect basement pipe sensors before re-opening." : "Monitor line pressure.",
        };
        db.alerts = [alert, ...db.alerts];
        responseData = { isEmergencyCutoffActive: db.isEmergencyCutoffActive, alert };
        break;
      }

      case "update_config": {
        db.config = { ...db.config, ...data };
        responseData = { config: db.config };
        break;
      }

      case "reset": {
        const restored = resetDatabase();
        return NextResponse.json(restored, { status: 200 });
      }

      default:
        return NextResponse.json({ error: `Unknown action '${action}'` }, { status: 400 });
    }

    // Persist to local JSON DB file on disk!
    writeDatabase(db);

    return NextResponse.json({ success: true, action, data: responseData, state: db }, { status: 200 });
  } catch (error: any) {
    console.error("API error processing action:", error);
    return NextResponse.json({ error: error.message || "Failed to process action" }, { status: 500 });
  }
}
