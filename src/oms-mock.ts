import { createServer } from "node:http";

const PORT = 3001;

const server = createServer((request, response) => {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk;
  });

  request.on("end", () => {
  const data = JSON.parse(body);

  console.log("Request body:");
  console.log(data);

  console.log("Name:", data.name);
  console.log("Address:", data.address);
  console.log("SKU:", data.sku);
  console.log("Quantity:", data.quantity);

  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json");

  response.end(
    JSON.stringify({
      message: "OMS Mock received the request",
    })
  );
});
});

server.listen(PORT, () => {
  console.log(`OMS Mock running at http://localhost:${PORT}`);
});