import { NextRequest, NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/server/db";
import { AlertNotification } from "@/types";

export async function GET() {
  const db = readDatabase();
  return NextResponse.json({ alerts: db.alerts, unreadCount: db.alerts.filter((a) => !a.isRead).length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDatabase();

    const newEntry: AlertNotification = {
      ...body,
      id: `alt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    db.alerts = [newEntry, ...db.alerts];
    writeDatabase(db);
    return NextResponse.json({ success: true, alert: newEntry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to trigger alert" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, isRead } = await req.json();
    const db = readDatabase();

    if (id === "all") {
      db.alerts = db.alerts.map((a) => ({ ...a, isRead: true }));
    } else {
      db.alerts = db.alerts.map((a) => (a.id === id ? { ...a, isRead: isRead !== undefined ? isRead : true } : a));
    }

    writeDatabase(db);
    return NextResponse.json({ success: true, unreadCount: db.alerts.filter((a) => !a.isRead).length }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update alert" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const db = readDatabase();

    if (id) {
      db.alerts = db.alerts.filter((a) => a.id !== id);
    }
    writeDatabase(db);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete alert" }, { status: 500 });
  }
}
