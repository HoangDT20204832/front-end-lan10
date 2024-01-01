import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Form} from 'antd';
import TableComponent from "../TableComp/index";
import InputComponent from "../InputComponent/InputComponent";
import * as orderService from "../../services/OrderService"
import {useQuery} from "@tanstack/react-query"
import DrawerComp from "../DrawerComp";
import { orderContant } from "../../contant";


const OrderInForAd = () => {
const [rowSelected,setRowSelected] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)


  const inittial= () =>({
    userName: "" , 
    phone : "",
    address : "",
    itemsPrice : "",
    shippingPrice : "",
    totalPrice : "",
    isPaid : "",
    isDelivered : "",
    deliveryMethod : "",
    paymentMethod : "",
  })


  const [stateOrderDetail, setStateOrderDetail] = useState(inittial())

  const [isOpenDrawer2, setIsOpenDrawer2] = useState(false)

  const [form] = Form.useForm()


 // hàm lấy toàn bộ thông tin sản phẩm
 const getAllOrder = async() =>{
  const res = await orderService.getAllOrder()
  // console.log('ressss', res)
  return res
 }


  const queryOrder = useQuery(['orders'],getAllOrder)
  const { data: orders } = queryOrder

  // console.log('products', products)
  const renderAction = () => {
    return (
      <div>
        <Button style={{ color: 'red', fontSize: '14px', cursor: 'pointer', marginRight:'5px' }} onClick={onDetailProduct} >Chi tiết </Button>
      </div>
    )
  }


const fetchGetDetailProduct = async(rowSelected) => {
    const res = await orderService.getDetailsOrder(rowSelected) //rowSelected: id sản phẩm
    if(res?.data){
      setStateOrderDetail({
        userName: res?.data?.shippingAddress?.fullName , 
        phone : res?.data?.shippingAddress?.phone,
        address : res?.data?.shippingAddress?.address,
        itemsPrice : res?.data?.itemsPrice,
        shippingPrice : res?.data?.shippingPrice,
        totalPrice : res?.data?.totalPrice,
        isPaid : res?.data?.isPaid ? "TRUE" : "FALSE",
        isDelivered : res?.data?.isDelivered ? "TRUE" : "FALSE",
        deliveryMethod : orderContant.delivery[res?.data?.deliveryMethod],
        paymentMethod : orderContant.payment[res?.data?.paymentMethod],
      })
    }
}

useEffect(() =>{
  if(rowSelected){
    fetchGetDetailProduct(rowSelected)
  }
}, [rowSelected])

// khi click vào nút chỉnh sửa => stateOrderDetail thay đổi =>
// form.setFieldsValue: form set giá trị thay đổi thông tin trong form 
// những giá trị của name="" của Form.Item trùng với các state trong stateProductDetail  = vs giá trị của stateProductDetail
useEffect(()=> {
  if(!isModalOpen){
    form.setFieldsValue(stateOrderDetail)
  }else{
    form.setFieldsValue(inittial())
  }
},[form, stateOrderDetail,isModalOpen])



  const columns = [
    {
      title: 'UserName',
      dataIndex: 'userName',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.userName.length - b.userName.length,
      // ...getColumnSearchProps('name')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,

    },
    {
      title: 'Địa chỉ ',
      dataIndex: 'address',
      sorter: (a, b) => a.address - b.address,

    },

    {
      title: 'Thanh toán',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid - b.isPaid,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod - b.paymentMethod,
    },
    
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return { ...order, key: order._id, userName: order?.shippingAddress.fullName
    , phone: order?.shippingAddress.phone, address: order?.shippingAddress.address,
    paymentMethod: orderContant.payment[order?.paymentMethod],
  isPaid: order?.isPaid ? "TRUE" : "FALSE"}
  })



//hàm để hiển thị chi tiết sản phẩm 
const onDetailProduct = () =>{
  //  console.log('GetDetailProduct', rowSelected)
  //  if(rowSelected){
  //   fetchGetDetailProduct(rowSelected)
  // }
  setIsOpenDrawer2(true)
}


// console.log(access_token)
  return (
    <div>
      <div className={styles.headerUser}>Quản lý đơn hàng</div>
      <div style={{marginTop: "20px"}}>
        <TableComponent columns={columns} data={dataTable}  onRow={(record, rowIndex) => {//record:là dữ liệu của dòng đó trong table
          return {
            onClick: event => {
              setRowSelected(record._id)
            }, // click row
          };
        }}/>
      </div>



{/* Drawer Detail */}
      <DrawerComp title="Chi tiết đơn hàng" isOpen={isOpenDrawer2} width="50%" onClose={() => setIsOpenDrawer2(false)}>
        <Form
        name="basic"
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 17,
        }}
        // onFinish={onUpdateProduct}
        autoComplete="on"
        form={form} 
      >
        <Form.Item
          label="Tên người mua"
          name="userName"
          rules={[
            {
              required: true,
              message: 'Please input your userName!',
            },
          ]}
        >
          <InputComponent value={stateOrderDetail.name} name="name"  />
        </Form.Item>

        <Form.Item
          label="Số điện thoại" name="phone"
          rules={[{required: true, message: 'Please input your type!',},]}
        >
          <InputComponent value={stateOrderDetail.phone} name="phone"  />
        </Form.Item>

        
        <Form.Item
          label="Giá sản phẩm"
          name="itemsPrice"
          rules={[
            {
              required: true,
              message: 'Please input your itemsPrice!',
            },
          ]}
        >
          <InputComponent value={stateOrderDetail.itemsPrice} name="itemsPrice"  />
        </Form.Item>

        <Form.Item
          label="Phí giao hàng" name="shippingPrice" 
          rules={[{required: true,message: 'Please input your shippingPrice!',}]}
        >
          <InputComponent value={stateOrderDetail.shippingPrice} name="shippingPrice" />
        </Form.Item>

        <Form.Item
          label="Tổng tiền" name="totalPrice" 
          rules={[{required: true,message: 'Please input your totalPrice!',}]}
        >
          <InputComponent value={stateOrderDetail.totalPrice} name="totalPrice" />
        </Form.Item>

        <Form.Item
          label="Đã thanh toán" name="isPaid" 
          rules={[{required: true,message: 'Please input your isPaid!',}]}
        >
          <InputComponent value={stateOrderDetail.isPaid} name="isPaid" />
        </Form.Item>

        <Form.Item
          label="Đã giao hàng" name="isDelivered" 
          rules={[{required: true,message: 'Please input your isDelivered!',}]}
        >
          <InputComponent value={stateOrderDetail.isDelivered} name="isDelivered" />
        </Form.Item>

        <Form.Item
          label="Đơn vị giao hàng" name="deliveryMethod" 
          rules={[{required: true,message: 'Please input your deliveryMethod!',}]}
        >
          <InputComponent value={stateOrderDetail.deliveryMethod} name="deliveryMethod"  />
        </Form.Item>

        <Form.Item
          label="Phương thức thanh toán" name="paymentMethod" 
          rules={[{required: true,message: 'Please input your paymentMethod!',}]}
        >
          <InputComponent value={stateOrderDetail.paymentMethod} name="paymentMethod"  />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 20,
            span: 16,
          }}
        >
          {/* <Button type="primary" htmlType="submit">
            Apply
          </Button> */}
        </Form.Item>
        </Form>
      </DrawerComp>

    </div>
  );
};

export default OrderInForAd;
