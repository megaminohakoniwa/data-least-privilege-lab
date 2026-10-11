import { createServer } from "node:http";

const PORT = 3000;
const OMS_URL = "http://localhost:3001";

const server = createServer((request, response) => {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk;
  });

  request.on("end", async () => {
    console.log("Gateway received:");
    console.log(body);

　　

　　const data = JSON.parse(body);
　　
　　if (!data.sku || !data.quantity) {
  response.statusCode = 400;
  response.setHeader("Content-Type", "application/json");

  response.end(
    JSON.stringify({
      message: "Missing required fields",
    })
  );

  return;
}

　　const allowedData = {
  　sku: data.sku,
  　quantity: data.quantity,
　　};

    try {
      const omsResponse = await fetch(OMS_URL, {
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