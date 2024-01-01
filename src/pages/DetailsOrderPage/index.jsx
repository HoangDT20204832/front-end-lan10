import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent,WrapperAllPriceOrder } from './style'
// import logo from '../../assets/images/logo.png'
import {  useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { orderContant } from '../../contant'
// import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import LoadingComp from "../../components/LoadingComp";

const DetailsOrderPage = () => {
  const params = useParams()
  // const location = useLocation()
  // const { state } = location
  const { id } = params

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id)
    // const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data
  }

  const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder }, {
    enabled: id
  })
  const { data,isLoading } = queryOrder

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + ((cur.priceNew * cur.amount))
    },0)
    return result
  },[data])

  return (
   <LoadingComp isLoading={isLoading}>
     <div style={{width: '100%', height: '100vh', background: '#f5f5fa'}}>
      <div style={{ width: '1200px', margin: '0 auto', height: '1200px'}}>
        <h4>Chi tiết đơn hàng</h4>
        <WrapperHeaderUser>
          <WrapperInfoUser>
            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
            <WrapperContentInfo>
              <div className='name-info'>{data?.shippingAddress?.fullName}</div>
              <div className='address-info'><span>Địa chỉ: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
              <div className='phone-info'><span>Điện thoại: </span> {data?.shippingAddress?.phone}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
            <WrapperContentInfo>
              <div className='delivery-info'><span className='name-delivery'>{orderContant.delivery[data?.deliveryMethod]} </span>Giao hàng tiết kiệm</div>
              <div className='delivery-fee'><span>Phí giao hàng: </span> {data?.shippingPrice}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
            <WrapperContentInfo>
              <div className='payment-info'>{orderContant.payment[data?.paymentMethod]}</div>
              <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>
        <WrapperStyleContent>
          <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{width: '500px'}}>Sản phẩm</div>
            <WrapperItemLabel>Giá</WrapperItemLabel>
            <WrapperItemLabel>Số lượng</WrapperItemLabel>
            <WrapperItemLabel>Giảm giá</WrapperItemLabel>
          </div>
          {data?.orderItems?.map((order,index) => {
            return (
              <WrapperProduct>
                <WrapperNameProduct>
                  <img key={index} src={order?.image} 
                    style={{
                      width: '70px', 
                      height: '70px', 
                      objectFit: 'cover',
                      border: '1px solid rgb(238, 238, 238)',
                      padding: '2px'
                    }}
                  />
                  <div style={{
                    width: 150,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap',
                    marginLeft: '10px',
                    // height: '70px',
                  }}>{order?.name}</div>
                </WrapperNameProduct>
                <WrapperItem style={{display:"flex", gap:"5px"}}>
                  <div style={{ textDecoration: "line-through"}}>{(order?.priceOld)?.toLocaleString()}đ</div>
                  <div style={{color: "var(--active-color"}}>{(order?.priceNew)?.toLocaleString()}đ</div>
                </WrapperItem>
                <WrapperItem>{order?.amount}</WrapperItem>
                <WrapperItem>{order?.discount ? ((order?.priceOld * order?.discount / 100)?.toLocaleString()) : '0 VND'}đ</WrapperItem>
                
                
              </WrapperProduct>
            )
          })}
          
          <WrapperAllPriceOrder>
          <WrapperAllPrice>
            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
            <WrapperItem>{(priceMemo)?.toLocaleString()}đ</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
            <WrapperItem>{(data?.shippingPrice)?.toLocaleString()}đ</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
            <WrapperItem><WrapperItem>{(data?.totalPrice)?.toLocaleString()}đ</WrapperItem></WrapperItem>
          </WrapperAllPrice>
          </WrapperAllPriceOrder>
      </WrapperStyleContent>
      </div>
    </div>
  </LoadingComp>
  )
}

export default DetailsOrderPage