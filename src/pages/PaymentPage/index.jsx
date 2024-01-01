import { Radio } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ButtonComponent from "../../components/ButtonComp/index";
import { useDispatch, useSelector } from "react-redux";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";
import styles from "./styles.module.css";
import {  Modal, Form } from "antd";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as userService from "../../services/UserService";
import * as orderService from "../../services/OrderService";
import * as messagee from "../../components/MessageComp";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentService from '../../services/PaymentService'
import LoadingComp from "../../components/LoadingComp";


const PaymentPage = () => {
  const navigate = useNavigate();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const [sdkReady , setSdkReady] = useState(false)


  const [isOpenUpdateInfor, setIsOpenUpdateInfor] = useState(false);
  const dispatch = useDispatch();

  const [stateUserDetail, setStateUserDetail] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    // sex : "",
  });
  const [form] = Form.useForm();

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce(
      (total, item) => total + item.priceNew * item.amount,
      0
    );
    return result;
  }, [order]);

  const transportPriceMemo = useMemo(() => {
    if ((300000 <= priceMemo) & (priceMemo <= 1000000)) {
      return 15000;
    } else {
      if (priceMemo <= 0 || priceMemo >= 1000000) {
        return 0;
      } else if (0 < priceMemo < 300000) {
        return 30000;
      }
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return priceMemo + transportPriceMemo;
  }, [priceMemo, transportPriceMemo]);

  // udpdate thông tin user khi ko đủ thoogn tin để giao hàng
  const mutationUpdate = useMutationHooks((data) => {
    const { id, ...rest } = data;
    const res = userService.updateUserInfor(id, { ...rest });
    return res;
  });

  const mutationAddOrder = useMutationHooks((data) => {
    const { ...rest } = data;
    const res = orderService.createOrder({ ...rest });
    return res;
  });
  const { data: dataOrder, isLoading:isLoadingAddOrder } = mutationAddOrder;
  const statusOrder = dataOrder?.status;

  useEffect(() => {
    if (statusOrder === "OK") {
      //nếu đăt hàng thành công thì sẽ xóa các đơn hàng đã checked trong giỏ hàng, rồi chyển tới mục thanh toán
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));

      messagee.success("Bạn đã đặt hàng thành công");
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    }
  }, [statusOrder]);

  const handleOnChangeInputDetail = (e) => {
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (isOpenUpdateInfor) {
      setStateUserDetail({
        ...stateUserDetail,
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenUpdateInfor]);

  // khi click vào nút chỉnh sửa => stateUserDetail thay đổi =>
  // form.setFieldsValue: form set giá trị thay đổi thông tin trong form
  // những giá trị của name="" của Form.Item trùng với các state trong stateUserDetail  = vs giá trị của stateUserDetail
  useEffect(() => {
    form.setFieldsValue(stateUserDetail);
  }, [form, stateUserDetail]);

  const handleCancelUpdate = () => {
    setStateUserDetail({
      name: "",
      phone: "",
      address: "",
      city: "",
    });
    form.resetFields();
    setIsOpenUpdateInfor(false);
  };

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate(
      { 
        // token: user?.access_token, 
        orderItems: order?.orderItemsSelected, 
        fullName: user?.name,
        address:user?.address, 
        phone:user?.phone,
        city: user?.city,
        paymentMethod: payment,
        deliveryMethod: delivery,
        itemsPrice: priceMemo,
        shippingPrice: transportPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        isPaid :true,
        paidAt: details.update_time, 
        // email: user?.email
      }
    )
  }

  const handleUpdateInforUser = () => {
    const { name, phone, address, city } = stateUserDetail;
    if (name && phone && address && city) {
      mutationUpdate.mutate(
        { id: user?.id, ...stateUserDetail },
        {
          onSuccess: () => {
            dispatch(updateUser({ ...user,_id: user?.id,  name, phone, address, city }));
            setIsOpenUpdateInfor(false);
          },
        }
      );
    }
  };

  //xử lý pần chon thanht phương thcws giao hàng và thanh toán
  const handleOnchaneAddress = () => {
    setIsOpenUpdateInfor(true);
  };

  const handleDilivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  const handleAddOrder = () => {
    if (
      user?.id &&
      user?.name &&
      user?.address &&
      user?.city &&
      user?.phone &&
      order?.orderItemsSelected &&
      priceMemo
    ) {
      mutationAddOrder.mutate({
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        city: user?.city,
        phone: user?.phone,
        paymentMethod: payment,
        deliveryMethod: delivery,
        itemsPrice: priceMemo,
        shippingPrice: transportPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
      });
    }
  };

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if(!window.paypal) {
      addPaypalScript()
    }else {
      setSdkReady(true)
    }
  }, [])
  return (
    <>
      {/* <div>PaymentPage</div> */}
      <LoadingComp isLoading={isLoadingAddOrder}>
        <div className={styles.cartCompWrap}>
          <div className={styles.headerCart}>
            {/* <div className={styles.headerCartItem}>SHOP BÁN HÀNG</div> */}
            <div className={styles.headerCartItem}>THANH TOÁN </div>
          </div>
          <div className={styles.cartComp}>
            <div className={styles.containerCart}>
              <div className={styles.containerCartLeft}>
                <div className={styles.containerCartLeftWrapperInfo}>
                  <div>
                    <div className={styles.containerCartLeftLable}>
                      Chọn phương thức giao hàng
                    </div>
                    <Radio.Group
                      className={styles.containerCartLeftRadio}
                      onChange={handleDilivery}
                      value={delivery}
                    >
                      <Radio value="fast">
                        <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                          NHANH
                        </span>{" "}
                        Giao hàng tiết kiệm
                      </Radio>
                      <Radio value="gojek">
                        <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                          HỎA TỐC
                        </span>{" "}
                        Giao hàng tiết kiệm
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div className={styles.containerCartLeftWrapperInfo}>
                  <div>
                    <div className={styles.containerCartLeftLable}>
                      Chọn phương thức thanh toán
                    </div>
                    <Radio.Group
                      className={styles.containerCartLeftRadio}
                      onChange={handlePayment}
                      value={payment}
                    >
                      <Radio value="later_money">
                        {" "}
                        Thanh toán tiền mặt khi nhận hàng
                      </Radio>
                      <Radio value="paypal"> Thanh toán bằng paypal</Radio>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <div className={styles.containerCartRight}>
                <div style={{ width: "100%" }}>
                  <div className={styles.containerCartRightInfor}>
                    <div>
                      <span>Đia chỉ: </span>
                      <span
                        style={{ color: "var(--active-color)", margin: "0 5px" }}
                      >{`${user?.address} - ${user?.city}`}</span>
                      <span
                        onClick={handleOnchaneAddress}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        Thay đổi{" "}
                      </span>
                    </div>
                  </div>

                  <div className={styles.containerCartRightInfor}>
                    <div className={styles.containerCartRightInforItem}>
                      <span>Tạm tính</span>
                      <span className={styles.containerCartRightInforPrice}>
                        {priceMemo.toLocaleString()}đ
                      </span>
                    </div>

                    <div className={styles.containerCartRightInforItem}>
                      <span>Phí vận chuyển</span>
                      <span className={styles.containerCartRightInforPrice}>
                        {transportPriceMemo.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                  <div className={styles.containerCartRightTotal}>
                    <span>Tổng tiền</span>
                    <span style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          color: "rgb(254, 56, 52)",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      >
                        {totalPriceMemo.toLocaleString()}đ
                      </span>
                      {/* <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span> */}
                    </span>
                  </div>
                </div>
                {payment === "paypal"  && sdkReady ? (
                  <div style={{width: '320px'}}>
                  <PayPalButton
                    amount={Math.round(totalPriceMemo / 30000)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert('Error')
                    }}
                  />
                </div>
                ) : (
                  <ButtonComponent
                    onClick={() => handleAddOrder()}
                    size={40}
                    styleButton={{
                      background: "rgb(255, 57, 69)",
                      height: "48px",
                      width: "220px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    textbutton={"Đặt hàng"}
                    styleTextButton={{
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  ></ButtonComponent>
                )}
              </div>
            </div>
          </div>
        </div>
      </LoadingComp>
      

      <Modal
        forceRender
        title="Cập nhật thông tin giao hàng"
        open={isOpenUpdateInfor}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInforUser}
      >
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
                message: "Please input your name!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetail.name}
              name="name"
              onChange={handleOnChangeInputDetail}
            />
          </Form.Item>

          <Form.Item
            label="SĐT"
            name="phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
          >
            <InputComponent
              value={stateUserDetail.phone}
              name="phone"
              onChange={handleOnChangeInputDetail}
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <InputComponent
              value={stateUserDetail.address}
              name="address"
              onChange={handleOnChangeInputDetail}
            />
          </Form.Item>

          <Form.Item
            label="Nơi sống"
            name="city"
            rules={[{ required: true, message: "Please input your city!" }]}
          >
            <InputComponent
              value={stateUserDetail.city}
              name="city"
              onChange={handleOnChangeInputDetail}
            />
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
  );
};

export default PaymentPage;
