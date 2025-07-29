export default async function getPastOrder(order) {
    const response = await fetch(`http://localhost:8000/api/past-orders/${order}`);
    const data = await response.json();
    console.log(data)
    return data
}