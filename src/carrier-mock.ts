import { createServer } from "node:http";

const PORT = 3002;

const server = createServer((request, response) => {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk;
  });

  request.on("end", () => {
    const data = JSON.parse(body);

    console.log("Carrier received:");
    console.log(data);

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");

    response.end(
      JSON.stringify({
        message: "Carrier received the request",
      })
    );
  });
});

server.listen(PORT, () => {
  console.log(`Carrier Mock running at http://localhost:${PORT}`);
});