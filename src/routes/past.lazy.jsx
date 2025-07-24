import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import getPastOrders from '../api/getPastOrders'

export const Route = createLazyFileRoute('/past')({
  component: PastOrdersRoute,
})

function PastOrdersRoute(){
    const [page, setPage] = useState(1);
    const {isLoading, data} = useQuery({
        queryKey: ['past-orders', page],
        queryFn: () => getPastOrders(page),
        staleTime: 30000
    });

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
                            <td>{order.id}</td>
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
    </div>
  );
}

