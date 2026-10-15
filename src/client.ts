async function main() {const order = {
  destination: "carrier",
  name: "Taro",
  address: "Fukuoka",
  sku: "ABC-123",
  quantity: 2,
  deliveryNote: "Please call 090-1234-5678 when you arrive",
};

  const response = await fetch("http://localhost:3000", {
    method: "POST",
    headers: {
  "Content-Type": "application/json",
  "x-api-key": "day5-secret",
},
    body: JSON.stringify(order),
  });

  const result = await response.json();

  console.log("Response from Gateway:");
  console.log(result);
}

main();