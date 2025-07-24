import { useContext, useEffect, useState } from 'react'
import Pizza from '../Pizza'
import Cart from '../Cart'
import { CartContext } from '../contexts'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/order')({
  component: Order,
})

const intl = new Intl.NumberFormat('en-Us', {
  style: 'currency',
  currency: 'USD',
})

export default function Order() {
  const [pizzaTypes, setPizzaTypes] = useState([])
  const [pizzaType, setPizzaType] = useState(null)
  const [pizzaSize, setPizzaSize] = useState('M')
  const [cart, setCart] = useContext(CartContext)
  const [loading, setLoading] = useState(true)

  async function checkout() {
    setLoading(true)

    const itemsToSend = []

    for (const item of cart) {
      const pizzaId = item.pizza_size_id
      const quantity = 1

      itemsToSend.push({
        pizza_size: pizzaId,
        quantity: quantity,
      })
    }
    console.log(itemsToSend, pizzaSize)
    console.log(cart)

    await fetch('http://localhost:8000/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: itemsToSend,
      }),
    })

    setCart([])
    setLoading(false)
  }

  let price, selectedPizza

  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizza.id == pizzaType)

    price = intl.format(
      selectedPizza.price ? selectedPizza.price[pizzaSize] : '',
    )
  }

  async function fetchPizzaTypes() {
    try {
      const pizzasRes = await fetch('http://localhost:8000/pizza/pizzas/')
      const pizzasJson = await pizzasRes.json()
      setPizzaTypes(pizzasJson)
      if (pizzasJson.length > 0) {
        setPizzaType(pizzasJson[0].id)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPizzaTypes()
  }, [])

  return (
    <div className="order-page">
      <div className="order">
        <h2>Create Order</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!selectedPizza) {
              console.error('Ошибка: Пицца не выбрана!')
              return
            }

            const selectedSizeObject = selectedPizza.sizes.find(
              (s) => s.size === pizzaSize,
            )

            if (!selectedSizeObject) {
              console.error('Ошибка: Выбранный размер не найден!')
              return
            }

            // --- ВОТ ГДЕ ИСПРАВЛЕНИЕ: СОХРАНЯЕМ ТОЛЬКО НУЖНЫЙ ID И ДРУГИЕ ДАННЫЕ В CART ---
            const newItem = {
              pizza_size_id: selectedSizeObject.id, // <--- ЭТО ID, КОТОРЫЙ НУЖЕН БЭКЕНДУ!
              quantity: 1, // Или возьмите из поля ввода количества
              // Можно сохранить другие данные для отображения в корзине,
              // чтобы не делать лишних запросов и не хранить весь объект Pizza:
              pizza_name: selectedPizza.name,
              size_label: selectedSizeObject.size,
              item_price: parseFloat(selectedSizeObject.price), // Цена как число
              pizza_image_url: selectedPizza.image_url,
            }
            // -----------------------------------------------------------------------------

            setCart([...cart, newItem])
            console.log('Добавлено в корзину:', newItem)
          }}
        >
          <div>
            <div>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                onChange={(e) => setPizzaType(e.target.value)}
                name="pizza-type"
                value={pizzaType}
              >
                {pizzaTypes.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pizza-size">Pizza Size</label>
              <div>
                <span>
                  <input
                    onChange={(e) => setPizzaSize(e.target.value)}
                    checked={pizzaSize === 'S'}
                    type="radio"
                    name="pizza-size"
                    value="S"
                    id="pizza-s"
                  />
                  <label htmlFor="pizza-s">Small</label>
                </span>
                <span>
                  <input
                    onChange={(e) => setPizzaSize(e.target.value)}
                    checked={pizzaSize === 'M'}
                    type="radio"
                    name="pizza-size"
                    value="M"
                    id="pizza-m"
                  />
                  <label htmlFor="pizza-m">Medium</label>
                </span>
                <span>
                  <input
                    onChange={(e) => setPizzaSize(e.target.value)}
                    checked={pizzaSize === 'L'}
                    type="radio"
                    name="pizza-size"
                    value="L"
                    id="pizza-l"
                  />
                  <label htmlFor="pizza-l">Large</label>
                </span>
              </div>
            </div>
            <button type="submit">Add to Cart</button>
          </div>
          {loading ? (
            <h3>LOADING …</h3>
          ) : (
            <div className="order-pizza">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image_url}
              />
              <p>{price}</p>
            </div>
          )}
        </form>
      </div>
      {loading ? <h2>LOADING …</h2> : <Cart cart={cart} checkout={checkout} />}
    </div>
  )

}
