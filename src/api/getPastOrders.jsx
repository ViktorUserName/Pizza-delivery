export default async function getPastOrders(page){
    const response = await fetch(`http://178.62.234.8/api/past-orders?page=${page}`)
    const data = await response.json();
    console.log(data)
    return data;
}