import { createServer } from "node:http";

const PORT = 3000;
const OMS_URL = "http://localhost:3001";
const CARRIER_URL = "http://localhost:3002";

const server = createServer((request, response) => {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk;
  });

  request.on("end", async () => {
    console.log("Gateway received:");
    console.log(body);

　　

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

  response.end(
    JSON.stringify({
      message: "PII detected in free text",
    })
  );

  return;

}


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