export default async function getPastOrder(order) {
    const response = await fetch(`http://178.62.234.8/api/past-orders/${order}/`);
    const data = await response.json();
    console.log(data)
    return data
}


