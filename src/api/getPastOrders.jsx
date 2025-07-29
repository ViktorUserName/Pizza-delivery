export default async function getPastOrders(page){
    const response = await fetch(`http://localhost:8000/api/past-orders?page=${page}`)
    const data = await response.json();
    console.log(data)
    return data;
}