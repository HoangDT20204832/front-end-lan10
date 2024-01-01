import { Col, Input, Radio, Row, Select, Button, Upload } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
// import ImgCrop from "antd-img-crop";
import { useDispatch, useSelector } from "react-redux";
import * as messagee from "../../components/MessageComp/index"
import {WrapperUploadFile } from './styles'
import { UploadOutlined} from '@ant-design/icons'
import ButtonComponent from "../../components/ButtonComp/index";
import * as userService from "../../services/UserService"
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slides/userSlide";

const AccountPage = () => {

  const options1 = [];
  for (let i = 1; i <= 31; i++) {
    options1.push({
      value: i,
      label: i,
    });
  }
  const options2 = [];
  for (let i = 1; i <= 12; i++) {
    options2.push({
      value: `Tháng ${i}`,
      label: `Tháng ${i}`,
    });
  }
  const options3 = [];
  for (let i = 1910; i <= 2023; i++) {
    options3.push({
      value: `Năm ${i}`,
      label: `Năm ${i}`,
    });
  }
  const handleChange = (value) => {
    // console.log(`Selected: ${value}`);
  };
  const [size, setSize] = useState("middle");


  const user = useSelector((state) => state.user)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(0);
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState("");
  const plainOptions = ["Nam", "Nữ", "Khác"];
  const [sex, setSex] = useState("Nam");
  const dispatch = useDispatch()
  const mutation = useMutationHooks(
    ( data) =>{ 
      const {id, ...rest} = data;
      // console.log("test datta", data)
      const res = userService.updateUserInfor(id, rest)
      return res
    }
 )
  const {data: dataUser} = mutation
// console.log("mutationUser", mutation)

  const handleChangeSex = ({ target: { value } }) => {
    // console.log("radio1 checked", value);
    setSex(value);
  };
  useEffect(() =>{
    setName(user?.name)
    setEmail(user?.email)
    setAddress(user?.address)
    setPhone(user?.phone)
    setAvatar(user?.avatar)
  },[user])

  useEffect(() =>{
    if( dataUser?.status ==="OK"){
      messagee.success("Cập nhập người dùng thành công")
      setTimeout(()=>{
      handleGetDetailUser(user?.id, user?.access_token)
      },500)      
    }
    // else{
    //   messagee.error("Cập nhập người dùng thất bại")
    // }
  }, [dataUser])

  const handleGetDetailUser = async(id, access_token) =>{
    const res = await userService.getDetailUser(id, access_token)
    // console.log("res", res) // gồm data, status, message
    dispatch(updateUser({...res?.data, access_token}))
}

  const handleChangeName = (e) =>{
    setName(e.target.value)
    // console.log(e.target.value)
  }
  const handleChangeEmail = (e) =>{
    setEmail(e.target.value)
  }

  const handleChangePhone = (e) =>{
      setPhone(e.target.value)
  }
  // const handleChangeAddress = () =>{
  //   //  setAddress(e.target.value)
  // }
  //up file  ảnh đại diện

  const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleChangeAvatar = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj );
    }
    setAvatar(file.preview)
}


  const handleUpdateUser = () =>{
    mutation.mutate({id: user?.id, name, email, phone, address, avatar, sex});
    // console.log('update user', name, email, phone, address, avatar, sex)
  }

  return (
    // <div className={styles.wrapAccount}>
    //   <Row className="grid">
    //     <NavbarAcountComp />
        <Col span={20} className={styles.container}>
          <div className={styles.containerHeader}>Hồ Sơ Của Tôi</div>
          <Row className={styles.containerContent}>
            <Col span={17} className={styles.containerInfor}>
              <div className={styles.containerItem}>
                <div className={styles.containerItemText}>Tên đăng nhập</div>
                <div>{name}</div>
              </div>

              <div className={styles.containerItem}>
                <div className={styles.containerItemText}>Tên</div>
                <div>
                  <Input
                    placeholder="Nhap ten"
                    style={{
                      padding: "8px",
                    }}
                    value={name} onChange={handleChangeName}
                  />
                </div>
              </div>

              <div className={styles.containerItem}>
                <div className={styles.containerItemText}>Email</div>
                <div>
                <Input
                    placeholder="Nhap ten"
                    style={{
                      padding: "8px",
                    }}
                    value={email} onChange={handleChangeEmail}
                  />
                </div>
              </div>

              <div className={styles.containerItem}>
                <div className={styles.containerItemText}>Số điện thoại</div>
                <div>
                <Input
                    placeholder="Nhập số điện thoại"
                    style={{
                      padding: "8px",
                    }}
                    value={phone} onChange={handleChangePhone}
                  />
                </div>
              </div>

              <div className={styles.containerItem}>
                <div className={styles.containerItemText}>Giới tính</div>
                <div>
                  <Radio.Group
                    options={plainOptions}
                    onChange={handleChangeSex}
                    value={sex}
                  />
                </div>
              </div>

              <div className={styles.containerItem}>
                <div className={styles.containerItemText}>Ngày sinh</div>
                <div>
                  <Select
                    className={styles.containerBorn}
                    size={size}
                    defaultValue="17"
                    onChange={handleChange}
                    style={{
                      width: 140,
                    }}
                    options={options1}
                  />
                  <Select
                    className={styles.containerBorn}
                    size={size}
                    defaultValue="Tháng 4"
                    onChange={handleChange}
                    style={{
                      width: 140,
                    }}
                    options={options2}
                  />
                  <Select
                    className={styles.containerBorn}
                    size={size}
                    defaultValue="Năm 2002"
                    onChange={handleChange}
                    style={{
                      width: 140,
                    }}
                    options={options3}
                  />
                </div>
              </div>

              <ButtonComponent
                  onClick={handleUpdateUser}
                  styleButton={{
                      padding:'5px', height:'38px', width:'70px', background:'var(--primary-color)',
                      borderRadius:'5px',
                      marginTop:'30px',
                      marginLeft:"180px"
                  }}
                  textbutton={'Lưu'}
                  styleTextButton={{color:'#fff', fontSize:'15px', fontWeight:'bold'}}
                  size={40}
              >
              </ButtonComponent>
            </Col>

            <Col span={7} className={styles.containerImg}>
            <div>{avatar && (
                    <img src={avatar} style={{
                        height: '100px',
                        width: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }} alt="avatar"/>
                )}</div>
              <WrapperUploadFile onChange={handleChangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </WrapperUploadFile>
              
            </Col>
          </Row>
        </Col>
    //   </Row>
    // </div>
  );
};

export default AccountPage;
