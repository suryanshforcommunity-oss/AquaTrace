import { NextRequest, NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/server/db";
import { WaterSavingLog, ForumPost, AlertNotification } from "@/types";

export async function GET() {
  const db = readDatabase();
  return NextResponse.json({
    savings: db.waterSavingLogs,
    forum: db.forumPosts,
    advisories: db.advisories,
  });
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { type, data } = payload;
    const db = readDatabase();

    if (type === "saving") {
      const newEntry: WaterSavingLog = {
        ...data,
        id: `wsl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
      };
      db.waterSavingLogs = [newEntry, ...db.waterSavingLogs];

      const alert: AlertNotification = {
        id: `alt_${Date.now()}_wsl`,
        societyId: newEntry.societyId,
        title: `Community Water Saving: +${(newEntry.measuredLitersSaved || newEntry.estimatedLitersSaved).toLocaleString()} L`,
        message: `${newEntry.residentName} (${newEntry.apartmentUnit}) logged water saving: ${newEntry.activityTitle}.`,
        severity: "success",
        source: "Conservation Hub",
        recommendedAction: "View community leaderboard standings.",
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: "/dashboard/conservation",
      };
      db.alerts = [alert, ...db.alerts];
      writeDatabase(db);
      return NextResponse.json({ success: true, saving: newEntry }, { status: 201 });
    }

    if (type === "forum_post") {
      const newEntry: ForumPost = {
        ...data,
        id: `fp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        upvotes: 1,
        repliesCount: 0,
      };
      db.forumPosts = [newEntry, ...db.forumPosts];
      writeDatabase(db);
      return NextResponse.json({ success: true, post: newEntry }, { status: 201 });
    }

    if (type === "upvote") {
      const { id } = data;
      db.forumPosts = db.forumPosts.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
      writeDatabase(db);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (type === "verify_saving") {
      const { id, adminName } = data;
      db.waterSavingLogs = db.waterSavingLogs.map((s) =>
        s.id === id ? { ...s, isVerifiedByAdmin: true, verifiedBy: adminName } : s
      );
      writeDatabase(db);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed in conservation API" }, { status: 500 });
  }
}
