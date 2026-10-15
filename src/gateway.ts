import { createServer } from "node:http";

const PORT = 3000;
const OMS_URL = "http://localhost:3001";
const CARRIER_URL = "http://localhost:3002";
const API_KEY = "day5-secret";

const server = createServer((request, response) => {

  const apiKey = request.headers["x-api-key"];

if (apiKey !== API_KEY) {
  response.statusCode = 401;
  response.end(
    JSON.stringify({
      message: "Unauthorized",
    })
  );

  return;
}
  let body = "";

  request.on("data", (chunk) => {
    body += chunk;
  });

  request.on("end", async () => {
    console.log("Gateway request received");

　　

　　const data = JSON.parse(body);

let targetUrl;
let allowedData;

if (data.destination === "oms") {
  targetUrl = OMS_URL;

  allowedData = {
    sku: data.sku,
    quantity: data.quantity,
  };
} else if (data.destination === "carrier") {
  targetUrl = CARRIER_URL;

  allowedData = {
    name: data.name,
    address: data.address,
　　 deliveryNote: data.deliveryNote,
  };
} else {
  response.statusCode = 400;

  response.end(
    JSON.stringify({
      message: "Unknown destination",
    })
  );

  return;
}
　　
　　function containsPhone(value: unknown): boolean {
  if (typeof value === "string") {
    return /\d{2,4}-\d{2,4}-\d{3,4}/.test(value);
  }

  if (Array.isArray(value)) {
    return value.some(containsPhone);
  }

  if (value !== null && typeof value === "object") {
    return Object.values(value).some(containsPhone);
  }

  return false;
}

　　const phonePattern = /\d{2,4}-\d{2,4}-\d{3,4}/;

if (containsPhone(data.deliveryNote)) {
  response.statusCode = 400;

   console.log({
  event: "pii_blocked",
  destination: data.destination,
});

  response.end(
    JSON.stringify({
      message: "PII detected in free text",
    })
  );

  return;

}

console.log({
  destination: data.destination,
  forwardedFields: Object.keys(allowedData),
});

    try {
      const omsResponse = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allowedData),
      });

      const omsBody = await omsResponse.text();

      response.statusCode = omsResponse.status;
      response.setHeader("Content-Type", "application/json");
      response.end(omsBody);
    } catch (error) {
      console.error("Failed to reach OMS:", error);

      response.statusCode = 502;
      response.setHeader("Content-Type", "application/json");

      response.end(
        JSON.stringify({
          message: "Gateway failed to reach OMS",
        })
      );
    }
  });
});

server.listen(PORT, () => {
  console.log(`Gateway running at http://localhost:${PORT}`);
});