import React,{ useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
// import * as ReviewService from '../../services/reviewService'
import { useSelector } from 'react-redux';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus,
  ModalOverlay } from './style';
import ButtonComponent from '../../components/ButtonComp/index';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/MessageComp/index'
import ReviewComponent from '../../components/ReviewComp';
import {Col} from "antd"
import LoadingComp from "../../components/LoadingComp";


const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id)
    return res.data
  }
  const user = useSelector((state) => state.user)
  const idsOrderReviewed = useSelector((state) => state.order.idsOrderReviewed)
  const [isOpenReview, setIsOpenReview] = useState(false)
  const [orderReview, setOrderReview] = useState('')

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
    enabled: state?.id   // enabled trong useQuery giúp kiểm soát xem query nên tự động thực hiện hay không, dựa trên một điều kiện cụ thể
  })
  const { isLoading, data } = queryOrder
  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`
    // , {
    //   state: {
    //     token: state?.token
    //   }
    // }
    )
  }

  const mutation = useMutationHooks(
    (data) => {
      const { id , orderItems, userId } = data
      const res = OrderService.cancelOrder(id,orderItems, userId)
      return res
    }
  )

  const handleCanceOrder = (order) => {
    mutation.mutate({id : order._id, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => {
        queryOrder.refetch()
      },
    })
  }
  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success("Hủy đơn hàng thành công")
    } else if(isSuccessCancel && dataCancel?.status === 'ERROR') {
      message.error(dataCancel?.message)
    }else if (isErrorCancle) {
      message.error()
    }
  }, [isErrorCancle, isSuccessCancel])

  const renderProduct = (data) => {
    return data?.map((order) => {
      return <WrapperHeaderItem key={order?._id}> 
              <img src={order?.image} 
                style={{
                  width: '70px', 
                  height: '70px', 
                  objectFit: 'cover',
                  border: '1px solid rgb(238, 238, 238)',
                  padding: '2px'
                }}
              />
              <div style={{
                width: 260,
                overflow: 'hidden',
                textOverflow:'ellipsis',
                whiteSpace:'nowrap',
                marginLeft: '10px'
              }}>{order?.name}</div>
              <span style={{ fontSize: '13px', color: '#242424',marginLeft: 'auto' }}>{(order?.priceNew)?.toLocaleString()}đ</span>
            </WrapperHeaderItem>
          })
  }

  //các code xử lý khi ấn vào button đã nhận hàng thì sẽ cập nhật lại thông tin đơn hàng
  const mutationUpdate = useMutationHooks(
    (data) => {
      const res = OrderService.updateOrderDetails(data.id, data)
      return res
    }
  )
  const handlReceiveOrder = (order) =>{
    mutationUpdate.mutate({orderId : order._id, isDelivered: true, isPaid: true }, {
      onSuccess: () => {
        queryOrder.refetch()
      },
    })     
  }

  const {data: dataUpdate} = mutationUpdate
  // console.log("dataUpdate", dataUpdate)

  useEffect(() => {
    if (dataUpdate?.status === 'OK') {
      message.success("Đã nhận hàng")
    }
  }, [dataUpdate?.status])


//code xử lý đánh giá sanmr phẩm
  const handleReviewOrder = (order) =>{
      setIsOpenReview(true)
      setOrderReview(order)
  }

  const closeReviewModal = ()=>{
    setIsOpenReview(false)
  }

  // const [reviewedOrders, setReviewedOrders] = useState([]);
//  console.log('reviewedOrders', reviewedOrders)
  return (
    <LoadingComp isLoading={isLoading || isLoadingCancel}>
    <Col span={20}>
        <div style={{height: '100%',width:"100%", margin: '0 auto'}}>
          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>
                      <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>{`${order.isDelivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</span>
                    </div>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán: </span>
                      <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                      <span 
                        style={{ fontSize: '13px', color: 'rgb(56, 56, 61)',fontWeight: 700 }}
                      >{(order?.totalPrice)?.toLocaleString()}đ</span>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                    {(order?.isDelivered &&  order?.isPaid && !idsOrderReviewed.includes(order?._id))  &&  
                     <ButtonComponent
                        onClick={() => handleReviewOrder(order)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px',
                            background: "var(--active-color)"
                        }}
                        textbutton={'Đánh giá'}
                        styleTextButton={{ color: 'var(--white-color)', fontSize: '14px' }}
                      >
                      </ButtonComponent>}

                    {/* nếu đơn hàng đã giao và đã thanh toán thì sẽ bỏ nút huy đơn hàng đi */}
                     {(order?.isDelivered ===false  || order?.isPaid === false)  &&  
                     <ButtonComponent
                        onClick={() => handleCanceOrder(order)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                        }}
                        textbutton={'Hủy đơn hàng'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>}
                      {(order?.isDelivered ===false  || order?.isPaid === false)
                      ?(<ButtonComponent
                        onClick={() => handlReceiveOrder(order)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px',
                            background: "var(--active-color)"
                        }}
                        textbutton={'Đã nhận hàng'}
                        styleTextButton={{ color: '#fff', fontSize: '14px' }}
                      >
                      </ButtonComponent>)
                      :<ButtonComponent
                      onClick={() => navigate(`/product-detail/${order?.orderItems[0]?.product}`)}
                      size={40}
                      styleButton={{
                          height: '36px',
                          border: '1px solid #9255FD',
                          borderRadius: '4px',
                          background: "var(--active-color)"
                      }}
                      textbutton={'Mua lại'}
                      styleTextButton={{ color: '#fff', fontSize: '14px' }}
                    >
                    </ButtonComponent>
                      }
                      
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                        }}
                        textbutton={'Xem chi tiết'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>

        </div>
        { isOpenReview && <div>
          <ModalOverlay ></ModalOverlay>
          <ReviewComponent orderReview={orderReview} onClose={closeReviewModal}  /></div>}

    </Col>
      
     </LoadingComp>
  )
}

export default MyOrderPage