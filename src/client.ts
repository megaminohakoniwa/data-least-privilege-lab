async function main() {
  const order = {
    name: "Taro",
    address: "Fukuoka",
　　email: "taro@example.com",
    sku: "ABC-123",
　　quantity: 2,
　　destination: "carrier",
　　deliveryNote: {
  text: "Please call 090-1234-5678 when you arrive"
},
  };

  const response = await fetch("http://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  const result = await response.json();

  console.log("Response from Gateway:");
  console.log(result);
}

main();