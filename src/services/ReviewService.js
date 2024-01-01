import axios from "axios";
export const axiosJWT = axios.create()

export const createReview  = async(data) =>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/review/create-review`,data);
    return res.data
}

export const getReviewsByProduct  = async(productId,ratingPoint,hasImg) =>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/review/get-reviews-product/${productId}?ratingPoint=${ratingPoint}&hasImg=${hasImg}`);
    return res.data
}
