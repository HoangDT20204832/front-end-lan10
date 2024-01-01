import { Checkbox,InputNumber } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { MinusOutlined, PlusOutlined} from '@ant-design/icons'
import ButtonComponent from '../../components/ButtonComp/index';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectOrder } from '../../redux/slides/orderSlide';
import styles from "./styles.module.css";
import {   Modal,Form} from 'antd';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as userService from "../../services/UserService"
import * as messagee from "../../components/MessageComp"
import { updateUser } from '../../redux/slides/userSlide';
import {useNavigate} from "react-router-dom"

const OrderPage = () => {
  const navigate = useNavigate()
  const order = useSelector((state) => state.order)
  const [listChecked, setListChecked] = useState([])
  const user = useSelector((state) => state.user)
  const[isOpenUpdateInfor, setIsOpenUpdateInfor] = useState(false)
  const dispatch = useDispatch()
  const onChange = (e) => {
    if(listChecked.includes(e.target.value)){ //nếu check đã listCheck đã có rồi mà lại check thì sẽ xóa checked đó đi 
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else {
      setListChecked([...listChecked, e.target.value])
    }
    // console.log(`checked = ${e.target.value}`)
  };
  const [stateUserDetail, setStateUserDetail] = useState({
    name: "" , 
    phone : "",
    address : "",
    city : "",
    // sex : "",
  })
  const [form] = Form.useForm() 
  
  const handleChangeCount = (type, idProduct,limited) => {
    if(type === 'increase') {
      if(!limited){   //nếu limited=false hay số lượng chưa = max(countInStock) thì vẫn tăng,=true thì ko tăng nữa
        dispatch(increaseAmount({idProduct}))
      }
    }else if(type === 'decrease'){
      if(!limited){ ////nếu limited=false hay số lượng chưa = 0 thì vẫn giảm, giảm về 0 thì ko giảm nữa
        dispatch(decreaseAmount({idProduct}))
      }
    }
  }

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }

  //hàm xử lý khi click vào checkbox chọn tất cả
  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    }else {
      setListChecked([])
    }
  }

  const handleDeleteAllOrder = () => {
    if(listChecked?.length > 1){
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }

  //xử lý phần tính tiền các sản phẩm chọn mua
  useEffect(() =>{
      dispatch(selectOrder({listChecked}))
  },[listChecked])

  const priceMemo = useMemo(() =>{
      const result = order?.orderItemsSelected?.reduce(
        (total, item) => total + (item.priceNew * item.amount)
      ,0)
      return result
  }, [order])

  const transportPriceMemo = useMemo(() =>{
   if(300000 <= priceMemo & priceMemo <= 1000000){
    return 15000
   } else {
    if(priceMemo <=0 || priceMemo>=1000000){
      return 0
    }else if(0 < priceMemo < 300000){
      return 30000
    }
   }
  
}, [priceMemo])

const totalPriceMemo = useMemo(() =>{
      return priceMemo + transportPriceMemo
},[priceMemo,transportPriceMemo])

// udpdate thông tin user khi ko đủ thoogn tin để giao hàng
const mutationUpdate = useMutationHooks(
  ( data) =>{ 
    // setLoading(true)
    const {id ,  ...rest } = data;
    const res = userService.updateUserInfor(id, {...rest} )
    return res
    }
)
const {data: dataUpdated, isSuccess: isSuccessUpdated, isError:isErrorUpdated} = mutationUpdate

  const handleOnChangeInputDetail = (e) =>{
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value
    })
}
useEffect(() =>{
    if(isOpenUpdateInfor){
      setStateUserDetail({
        ...stateUserDetail,
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
},[isOpenUpdateInfor])

// khi click vào nút chỉnh sửa => stateUserDetail thay đổi =>
// form.setFieldsValue: form set giá trị thay đổi thông tin trong form 
// những giá trị của name="" của Form.Item trùng với các state trong stateUserDetail  = vs giá trị của stateUserDetail
useEffect(()=> {
  form.setFieldsValue(stateUserDetail)
},[form, stateUserDetail])

const handleAddCard = () =>{
  if(!order?.orderItemsSelected?.length){
    messagee.error("Vui lòng chọn sản phẩm")
  }else if(!user?.name || !user?.phone || !user?.address || !user?.city){
        setIsOpenUpdateInfor(true)
    } else{
      navigate('/payment')
    }
}
const handleCancelUpdate = () =>{
    setStateUserDetail({
    name: "" , 
    phone : "",
    address : "",
    city : "",
    // sex : "",
    })
  form.resetFields()
  setIsOpenUpdateInfor(false)
}

const handleUpdateInforUser = () =>{
  const {name, phone, address, city} = stateUserDetail
  if(name&&phone&&address&&city){ 
    mutationUpdate.mutate({id: user?.id , ...stateUserDetail},{
      onSuccess: ()=>{
        dispatch(updateUser({...user, _id: user?.id,name, phone, address, city}))
        setIsOpenUpdateInfor(false)
        messagee.success("Cập nhật địa chỉ thành công")
      }
    })
}
// form.resetFields()
}


const handleOnchaneAddress = () =>{
  setIsOpenUpdateInfor(true)
}
  return (
    // <LoadingComp isLoading={loading}>
    <>
    <div className={styles.cartCompWrap} >
      <div className={styles.headerCart}>
              <div className={styles.headerCartItem}>SHOP BÁN HÀNG</div>
              <div className={styles.headerCartItem}>GIỎ HÀNG </div>
          </div>
      <div className={styles.cartComp} >
        <div className={styles.containerCart} >
          <div className={styles.containerCartLeft}>
            <div className={styles.containerCartLeftHeader}>
                <span style={{display: 'inline-block', width: '390px'}}>
                  <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                  <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Số tiền</span>
                  <button style={{cursor: 'pointer'}} onClick={handleDeleteAllOrder}>Xóa</button>
                </div>
            </div>
            <div className={styles.containerCartLeftBody}>
              {order?.orderItems?.map((order,index) => {
                return ( 
                  <div key={index} className={styles.containerCartLeftItem}>
                    <div style={{width: '350px', display: 'flex', alignItems: 'center', gap: 4}}> 
                      {/* <Checkbox onChange={onChange} value={order?.product} ></Checkbox> */}
                      <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                      <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                      <div className={styles.containerCartName}>{order?.name}</div>
                    </div>
                    <div className={styles.containerCartWrapPrice} >
                      <span className={styles.containerCartUnitPrice}>
                        <span className={styles.containerCartUnitPriceOld} >{order?.priceOld?.toLocaleString()}đ</span>
                        <span className={styles.containerCartUnitPriceNew} >{order?.priceNew?.toLocaleString()}đ</span>
                        <div className={styles.containerCartDiscount} >Giảm giá {order?.discount}%</div>
                      </span>
                      <div className={styles.containerCartLeftCount}>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} 
                          onClick={() => handleChangeCount("decrease", order?.product,order?.amount===0)}>
                            <MinusOutlined style={{ color: '#000', fontSize: '10px' }}  />
                        </button>
                        <InputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInStock} />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} 
                          onClick={() => handleChangeCount("increase", order?.product,order?.amount === order?.countInStock)}>
                            <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                        </button>
                      </div>
                      <span className={styles.containerCartLeftPrices} >{(order?.priceNew * order?.amount)?.toLocaleString()}đ</span>
                      <button style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.product)}>Xóa</button>
                    </div>
                  </div>
                 ) 
               })} 
            </div>
          </div>
          <div className={styles.containerCartRight}>
            <div style={{width: '100%'}}>
            <div className={styles.containerCartRightInfor}>
              <div>
                <span>Đia chỉ: </span>
                <span style={{color:"var(--active-color)", margin:"0 5px"}}>{`${user?.address} - ${user?.city}`}</span>
                <span  onClick={handleOnchaneAddress} style={{color:"blue", cursor:"pointer"}}>Thay đổi </span>
              </div>
            </div>
                 
              <div className={styles.containerCartRightInfor}>
                <div  className={styles.containerCartRightInforItem} >
                  <span>Tạm tính</span>
                  <span className={styles.containerCartRightInforPrice} >{priceMemo.toLocaleString()}đ</span>
                </div>

                <div className={styles.containerCartRightInforItem}>
                  <span>Phí vận chuyển</span>
                  <span className={styles.containerCartRightInforPrice} >{transportPriceMemo.toLocaleString()}đ</span>
                </div>
              </div>
              <div className={styles.containerCartRightTotal}>
                <span>Tổng tiền</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{totalPriceMemo.toLocaleString()}đ</span>
                  {/* <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span> */}
                </span>
              </div>
            </div>
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '220px',
                  border: 'none',
                  borderRadius: '4px'
              }}
              textbutton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
          </div>
        </div>
      </div>
    </div>

    <Modal forceRender title="Cập nhật thông tin giao hàng" open={isOpenUpdateInfor}  onCancel={handleCancelUpdate} 
            onOk={handleUpdateInforUser}>

<Form
        name="basic"
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 17,
        }}
        // onFinish={onUpdateUser}
        autoComplete="on"
        form={form}
      >
        <Form.Item
          label="Tên người dùng"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
        >
          <InputComponent value={stateUserDetail.name} name="name" onChange={handleOnChangeInputDetail} />
        </Form.Item>

        <Form.Item
          label="SĐT" name="phone" 
          rules={[{required: true,message: 'Please input your phone!',}]}
        >
          <InputComponent value={stateUserDetail.phone} name="phone" onChange={handleOnChangeInputDetail}/>
        </Form.Item>

        <Form.Item
          label="Địa chỉ" name="address" 
          rules={[{required: true,message: 'Please input your address!',}]}
        >
          <InputComponent value={stateUserDetail.address} name="address" onChange={handleOnChangeInputDetail}/>
        </Form.Item>

        <Form.Item
          label="Nơi sống" name="city" 
          rules={[{required: true,message: 'Please input your city!',}]}
        >
          <InputComponent value={stateUserDetail.city} name="city" onChange={handleOnChangeInputDetail}/>
        </Form.Item>
     

        {/* <Form.Item
          wrapperCol={{
            offset: 20,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Apply
          </Button>
        </Form.Item> */}
        </Form>
    </Modal>
    </>
    // </LoadingComp>
  )
}


export default OrderPage;