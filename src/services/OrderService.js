import axios from "axios";
export const axiosJWT = axios.create()


export const createOrder  = async(data) =>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/order/create-order/${data.user}`,data);
    return res.data
}

export const getOrderByUserId = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`)
    return res.data
  }
  
  export const getDetailsOrder = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`)
    return res.data
  }
  
  export const cancelOrder = async (id, orderItems, userId ) => {
    const data = {orderItems, orderId: id}
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${userId}`, {data})
    return res.data
  }
  
  export const getAllOrder = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`)
    return res.data
  }

  export const updateOrderDetails = async (orderId, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/order/update-order/${orderId}`, data)
    return res.data
  }