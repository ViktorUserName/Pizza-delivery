import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import getPastOrders from '../api/getPastOrders'
import getPastOrder from '../api/getPastOrder'
import Modal from '../Modal'

const intl = new Intl.NumberFormat('en-Us', {
  style: 'currency',
  currency: 'USD',
})

export const Route = createLazyFileRoute('/past')({
  component: PastOrdersRoute,
})

function PastOrdersRoute(){
    const [page, setPage] = useState(1);
    const [focucedOrder, setFocusedOrder] = useState();
    const {isLoading, data} = useQuery({
        queryKey: ['past-orders', page],
        queryFn: () => getPastOrders(page),
        staleTime: 30000
    });

    const { isLoading: isLoadingPastOrder, data: pastOrderData } = useQuery({
      queryKey: ["past-order", focucedOrder],
      queryFn: () => getPastOrder(focucedOrder),
      staleTime: 24 * 60 * 60 * 1000,
      enabled: !!focucedOrder
    })

    if(isLoading || !data){
        return (
            <div className="past-orders">
                <h2>Loading...</h2>
            </div>
        )
    }

    const orders = data.results;
    const pageNum = data.count/10

    console.log(pageNum/10)

    return (
        <div className="past-orders">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Date</td>
            <td>Time</td>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
                        <tr key={order.id}>
                          <button onClick={() => setFocusedOrder(order.id)}>
                            <td>{order.id}</td>
                          </button>
                            <td>{order.date}</td>
                            <td>{order.time}</td>
                        </tr>
                    ))}
        </tbody>
      </table>
      <div className="pages">
<button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div>{page}</div>
        <button disabled={page > pageNum} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
            {
              focucedOrder ? (
                <Modal>
                  <h2>
                    Order #{focucedOrder}
                  </h2>
                  {!isLoadingPastOrder? (
                    <table>
                      <thead>
                        <tr>
                          <td>Image</td>
                          <td>Name</td>
                          <td>Size</td>
                          <td>Quantity</td>
                          <td>Price</td>
                        </tr>
                      </thead>
                      <tbody>
                        {pastOrderData.items.map((pizza) => (
                          <tr key={pizza.pizza_id}>
                            <td>
                              <img src={pizza.pizza_img} alt={pizza.pizza_name} />
                            </td>
                           <td>{pizza.pizza_name}</td>
                           <td>{pizza.pizza_size}</td>
                           <td>{pizza.quantity}</td>
                           <td>{pizza.pizza_price}</td>     
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p>Loading...</p>}
                  <button onClick={()=> setFocusedOrder()}>Close</button>
                </Modal>
              ): null
            }
    </div>
  );
}

