// const intl = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD", // feel free to change to your local currency
// });

// export default function Cart({ cart, checkout }) {
//   let total = 0;
//   for (let i = 0; i < cart.length; i++) {
//     const current = cart[i];
//     total += current.pizza.price[current.size];
//   }
//   return (
//     <div className="cart">
//       <h2>Cart</h2>
//       <ul>
//         {cart.map((item, index) => (
//           <li key={index}>
//             <span className="size">{item.size}</span> –
//             <span className="type">{item.pizza.name}</span> –
//             <span className="price">{item.price}</span>
//           </li>
//         ))}
//       </ul>
//       <p>Total: {intl.format(total)}</p>
//       <button onClick={checkout}>Checkout</button>
//     </div>
//   );
// }

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD", // feel free to change to your local currency
});

export default function Cart({ cart, checkout }) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const current = cart[i];
    // Теперь item_price уже число, благодаря parseFloat в Order/onSubmit
    total += current.item_price * current.quantity; // Умножаем на количество
  }

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p> // Добавляем сообщение, если корзина пуста
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {/* Используем новую структуру данных */}
              <span className="size">{item.size_label}</span> –
              <span className="type">{item.pizza_name}</span> –
              <span className="price">{intl.format(item.item_price)}</span>{" "}
              {/* Форматируем цену для отображения */}
              {item.quantity > 1 && (
                <span className="quantity"> (x{item.quantity})</span>
              )}{" "}
              {/* Отображаем количество, если больше 1 */}
            </li>
          ))}
        </ul>
      )}

      <p>Total: {intl.format(total)}</p>
      {/* Кнопка Checkout должна быть отключена, если корзина пуста или идет загрузка (если передадите пропс loading) */}
      <button onClick={checkout} disabled={cart.length === 0}>
        Checkout
      </button>
    </div>
  );
}
