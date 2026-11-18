# ESP32 IoT Hardware Telemetry & Firmware Integration Guide
## Community Water Intelligence & Conservation Platform

This guide documents the hardware interface, sensor selection, electrical wiring, calibration formulas, and production-ready Arduino C++ firmware for the telemetry nodes.

---

### 1. Hardware Architecture & Sensors

| Sensor Function | Recommended Hardware | Output Signal | Operating Range | Pin Connection |
|---|---|---|---|---|
| **Groundwater Depth** | Submersible Hydrostatic Pressure Transducer (316L Stainless) | 4–20 mA Current Loop (via 250Ω precision resistor) | 0–50 metres depth (water column) | ADC GPIO 34 (Analog) |
| **Usable Tank Level** | JSN-SR04T Weatherproof Ultrasonic Sensor | Pulse Width / Trigger-Echo | 20 cm – 450 cm | Trig: GPIO 5, Echo: GPIO 18 |
| **Gate Intake Flow** | Electromagnetic Flowmeter (Pulse Output) | Hall-Effect Digital Pulse (K-factor) | 10 – 500 LPM | Interrupt GPIO 19 |
| **Quality Screening** | Analog TDS & Optical Turbidity Probes | 0 – 3.3V Analog Voltage | 0–1000 ppm / 0–50 NTU | TDS: GPIO 35, Turbidity: GPIO 32 |
| **Microcontroller** | ESP32-WROOM-32D (Dual-Core 240MHz, Wi-Fi & Bluetooth) | Wi-Fi 802.11 b/g/n & LoRaWAN Node | — | Core Controller |

---

### 2. Groundwater Measurement Principle

Groundwater depth must **never be confused with tank level**:
- **Tank Level:** Height of water inside a storage vessel measured from the tank bottom or ceiling.
- **Groundwater Depth:** Distance from a fixed, surveyed wellhead casing datum (e.g., `+920.4m MSL`) down to the sub-surface water surface.
- **Transducer Calculation:**
  $$\text{Water Column Height } H = \frac{P}{\rho \cdot g}$$
  $$\text{Groundwater Depth Below Datum } D = L_{\text{cable}} - H$$
  Where $L_{\text{cable}}$ is the deployed suspension depth (e.g. 65.0m), and $H$ is the submerged hydrostatic head.

---

### 3. Production Arduino C++ Firmware (`esp32_water_node.ino`)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Wi-Fi Credentials
const char* ssid = "RWA_INFRA_WIFI";
const char* password = "SecureWaterMesh2026";

// Platform API Endpoint
const char* serverEndpoint = "https://aquatrace-grid.org/api/iot/ingest";
const char* deviceToken = "Bearer dev_sec_token_99x";

// Telemetry Metadata
const char* societyId = "soc_greenwood_01";
const char* deviceId = "esp32_gw_02";
const char* measurementPointId = "bw_02";

// Hardware Pins
const int HYDROSTATIC_PIN = 34; // 4-20mA transducer through 250 ohm shunt
const float CABLE_DEPLOYMENT_DEPTH = 65.0; // Metres from casing collar

void setup() {
  Serial.begin(115200);
  analogReadResolution(12); // 12-bit ADC (0 - 4095)
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Network! IP: " + WiFi.localIP().toString());
}

float readGroundwaterDepth() {
  // Read analog average to filter ripple
  long sum = 0;
  for (int i = 0; i < 30; i++) {
    sum += analogRead(HYDROSTATIC_PIN);
    delay(10);
  }
  float adcVal = sum / 30.0;
  float voltage = (adcVal / 4095.0) * 3.3;
  
  // 4-20mA conversion (0.8V to 3.3V across 250 ohm = 0 to 50m water head)
  float submergedHead = (voltage - 0.8) * (50.0 / 2.5);
  if (submergedHead < 0.0) submergedHead = 0.0;
  
  // Depth below casing datum
  float waterDepthBelowDatum = CABLE_DEPLOYMENT_DEPTH - submergedHead;
  return waterDepthBelowDatum;
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverEndpoint);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", deviceToken);

    float depthMeters = readGroundwaterDepth();

    // Construct JSON Payload
    StaticJsonDocument<256> doc;
    doc["societyId"] = societyId;
    doc["deviceId"] = deviceId;
    doc["measurementPointId"] = measurementPointId;
    doc["measurementType"] = "groundwater_depth";
    doc["value"] = round(depthMeters * 100.0) / 100.0;
    doc["unit"] = "m";
    doc["source"] = "iot";

    String requestBody;
    serializeJson(doc, requestBody);

    Serial.println("Transmitting Telemetry: " + requestBody);
    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response (" + String(httpResponseCode) + "): " + response);
    } else {
      Serial.println("Error on transmission: " + String(httpResponseCode));
    }
    http.end();
  }

  // Poll interval: 5 minutes (300,000 ms)
  delay(300000);
}
```

