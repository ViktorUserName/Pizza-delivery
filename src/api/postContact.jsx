export default async function postContact(name, email, message) {
    const response = await fetch('http://127.0.0.1:8000/contact/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name, email, message})
    })

    if (!response.ok){
        throw new Error("Network response was not ok. Send help.")
    }

    return await response.json()
}