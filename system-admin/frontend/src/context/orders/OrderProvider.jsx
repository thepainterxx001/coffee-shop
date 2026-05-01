import toast from "react-hot-toast"
import orderContext from "./orderContext"
import { useContext, useEffect, useState } from "react"
import { axiosOrder } from "../../lib/axios";
import authContext from "../auth/authContext";

const OrderProvider = ({ children }) => {
  const { authenticated } = useContext(authContext);
  const [ orders, setOrders ] = useState(null);

  const addOrder = async (payment, order) => {
    const orderData = {
      paymentMethod: payment,
      items: order,
      totalAmount: order?.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    }

    try {
      const res = await axiosOrder.post("/add-order", orderData);
      await getOrder();
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  }

  const getOrder = async () => {
    try {
      const res = await axiosOrder.get("/all-order");
      setOrders(res.data.allOrder);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  }

  const markPaid = async (id, paid) => {
    try {
      const res = await axiosOrder.put(`/all-order/${id}`, { paid });
      await getOrder();
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  }

  const removeOrder = async (id) => {
    try {
      const res = await axiosOrder.delete(`/all-order/${id}`);
      await getOrder();
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  }

  useEffect(() => {
    if(authenticated)
      getOrder();
  }, [authenticated])

  return (
    <orderContext.Provider value={{ addOrder, markPaid, removeOrder, orders }}>
      { children }
    </orderContext.Provider>
  )
}

export default OrderProvider