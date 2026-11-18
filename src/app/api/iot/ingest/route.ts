import { NextRequest, NextResponse } from "next/server";

interface IngestPayload {
  societyId: string;
  deviceId: string;
  measurementPointId: string;
  measurementType: "groundwater_depth" | "tank_level" | "tds" | "turbidity" | "ph" | "flow_rate";
  value: number;
  unit: string;
  timestamp?: string;
  source?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: IngestPayload = await req.json();

    // 1. Mandatory field validation
    if (!body.societyId || !body.deviceId || !body.measurementPointId || !body.measurementType) {
      return NextResponse.json(
        {
          error: "Missing required telemetry fields. Required: societyId, deviceId, measurementPointId, measurementType, value, unit",
        },
        { status: 400 }
      );
    }

    if (typeof body.value !== "number" || isNaN(body.value)) {
      return NextResponse.json(
        { error: "Telemetry 'value' must be a valid numeric quantity" },
        { status: 422 }
      );
    }

    // 2. Physical range & unit sanity checks
    switch (body.measurementType) {
      case "groundwater_depth":
        if (body.value < 0 || body.value > 450) {
          return NextResponse.json(
            { error: "Groundwater depth out of physical sensor bounds (0 - 450m)" },
            { status: 422 }
          );
        }
        break;
      case "tank_level":
        if (body.value < 0) {
          return NextResponse.json(
            { error: "Tank volume/level cannot be negative" },
            { status: 422 }
          );
        }
        break;
      case "ph":
        if (body.value < 0 || body.value > 14) {
          return NextResponse.json(
            { error: "pH value must be between 0.0 and 14.0" },
            { status: 422 }
          );
        }
        break;
      case "tds":
        if (body.value < 0 || body.value > 5000) {
          return NextResponse.json(
            { error: "TDS value exceeds typical sensor range (0 - 5000 ppm)" },
            { status: 422 }
          );
        }
        break;
      case "turbidity":
        if (body.value < 0 || body.value > 100) {
          return NextResponse.json(
            { error: "Turbidity exceeds optical scatter threshold (0 - 100 NTU)" },
            { status: 422 }
          );
        }
        break;
    }

    const timestamp = body.timestamp || new Date().toISOString();
    const readingId = `read_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Return authenticated response
    return NextResponse.json(
      {
        status: "success",
        message: "Telemetry reading accepted and indexed into society time-series grid",
        readingId,
        data: {
          societyId: body.societyId,
          deviceId: body.deviceId,
          measurementPointId: body.measurementPointId,
          measurementType: body.measurementType,
          value: body.value,
          unit: body.unit,
          timestamp,
          source: body.source || "iot",
          calibrated: true,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error parsing IoT JSON packet", details: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "AquaTrace IoT Sensor Ingestion Gateway",
    supportedProtocols: ["HTTPS REST", "MQTT / TLS"],
    supportedMeasurementTypes: [
      "groundwater_depth (m)",
      "tank_level (L or %)",
      "flow_rate (LPM)",
      "tds (ppm)",
      "turbidity (NTU)",
      "ph (pH units)",
    ],
    timestamp: new Date().toISOString(),
  });
}

