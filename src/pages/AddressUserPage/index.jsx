import {
  Col,
  Input,
  Radio,
  Row,
  Select,
  Button,
  Upload,
  Modal,
  Form,
} from "antd";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
// import ImgCrop from "antd-img-crop";
import { useDispatch, useSelector } from "react-redux";
import * as messagee from "../../components/MessageComp/index";
// import {WrapperUploadFile } from './styles'
// import { UploadOutlined} from '@ant-design/icons'
import clsx from "clsx";
import ButtonComponent from "../../components/ButtonComp/index";
import * as userService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slides/userSlide";
import NavbarAcountComp from "../../components/NavbarAcountComp";
import InputComponent from "../../components/InputComponent/InputComponent";

const AccountComp = () => {
  const handleChange = (value) => {
    // console.log(`Selected: ${value}`);
  };
  const [size, setSize] = useState("middle");
  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const mutation = useMutationHooks((data) => {
    const { id, ...rest } = data;
    // console.log("test datta", data);
    const res = userService.updateUserInfor(id, rest);
    return res;
  });
  const { data: dataUser } = mutation;
  // console.log("mutationUser", mutation)
  const [isOpenUpdateInfor, setIsOpenUpdateInfor] = useState(false);
  const [stateUserDetail, setStateUserDetail] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    // sex : "",
  });

  const handleOnchaneAddress = () => {
    setIsOpenUpdateInfor(true);
  };
  useEffect(() => {
    if (dataUser?.status === "OK") {
      messagee.success("Cập nhập người dùng thành công");
      setTimeout(() => {
        handleGetDetailUser(user?.id, user?.access_token);
      }, 500);
    }
    // else{
    //   messagee.error("Cập nhập người dùng thất bại")
    // }
  }, [dataUser]);

  const handleGetDetailUser = async (id, access_token) => {
    const res = await userService.getDetailUser(id, access_token);
    dispatch(updateUser({ ...res?.data, access_token }));
  };

  const handleUpdateInforUser = () => {
    const { name, phone, address, city } = stateUserDetail;
    if (name && phone && address && city) {
      mutation.mutate(
        { id: user?.id, ...stateUserDetail },
        {
          onSuccess: () => {
            // dispatch(updateUser({ ...user, name, phone, address, city }));
            setIsOpenUpdateInfor(false);
          },
        }
      );
    }
  };

  const [form] = Form.useForm();

  const handleCancelUpdate = () => {
    setStateUserDetail({
      name: "",
      phone: "",
      address: "",
      city: "",
      // sex : "",
    });
    form.resetFields();
    setIsOpenUpdateInfor(false);
  };

  //khi mở modal lên thì cập nhật thông tin user vào form
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

  const handleOnChangeInputDetail = (e) => {
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetail);
  }, [form, stateUserDetail]);
  return (
 
      <Col span={20} className={styles.container}>
        <div className={styles.containerHeader}>Địa chỉ của tôi</div>
        <Row className={styles.containerContent}>
          <div className={styles.containerContentHeader}>
            <span className={styles.containerContentHeaderItem}>
              <span>{user?.name}</span>
              <span>{user?.phone}</span>
            </span>

            <span
              className={styles.containerContentHeaderItem}
              onClick={handleOnchaneAddress}
            >
              Cập nhật
            </span>
          </div>
          <div className={styles.containerContentBody}>
            <div className={styles.containerContentBodyItem}>
              Địa chỉ nhận hàng:
            </div>
            <div className={styles.containerContentBodyItem}>
              {user?.address} - {user?.city}
            </div>
            <div className={styles.containerContentBodyItem}> Mặc định</div>
          </div>
        </Row>
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
              label="Số điện thoại"
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
              label="Địa chỉ cụ thể"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <InputComponent
                value={stateUserDetail.address}
                name="address"
                onChange={handleOnChangeInputDetail}
              />
            </Form.Item>

            <Form.Item
              label="Tỉnh/Thành phố"
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
      </Col>
     
   
  );
};

export default AccountComp;
