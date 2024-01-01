import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button,  Modal,Form} from 'antd';
import TableComponent from "../TableComp/index";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperUploadFile } from "../AccountComp/styles";
import * as userService from "../../services/UserService"
import {useMutationHooks} from "../../hooks/useMutationHook"
import * as messagee from "../../components/MessageComp"
import {useQuery} from "@tanstack/react-query"
// import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import DrawerComp from "../DrawerComp";
import {useSelector} from "react-redux"
import LoadingComp from "../LoadingComp";


const UserInforAd = () => {
  const user = useSelector((state) => state?.user)
const [rowSelected,setRowSelected] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)

  // const [stateUser, setStateUser] = useState({
  //   name: "" , 
  //   email : "",
  //   isAdmin : false,
  //   phone : "",
  //   address : "",
  //   avatar : "",
  //   city : "",
  //   // sex : "",
  // })

  const [stateUserDetail, setStateUserDetail] = useState({
    name: "" , 
    email : "",
    isAdmin : false,
    phone : "",
    address : "",
    avatar : "",
    city : "",
    // sex : "",
  })

  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isOpenDrawer2, setIsOpenDrawer2] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)

  const [form] = Form.useForm()

//   const mutationCreate = useMutationHooks(
//     ( data) =>{ 
//       const {   name , email, isAdmin, phone, address, avatar, city, sex } = data;
//       console.log("test datta", data)
//       const res = userService.createUser({name ,  email, isAdmin, phone, address, avatar, city, sex })
//       return res
//       }
//  )
 const mutationUpdate = useMutationHooks(
  ( data) =>{ 
    const {id ,  ...rest } = data;
    // console.log("test datta", data)
    const res = userService.updateUserInfor(id, {...rest} )
    return res
    },
)

const mutationDelete = useMutationHooks(
  ( data) =>{ 
    const {id ,  ...rest } = data;
    // console.log("test datta delete", data)
    const res = userService.deleteUserInfor(id, {...rest} )
    return res
    },
)

 // hàm lấy toàn bộ thông tin sản phẩm
 const getAllUsers = async() =>{
  const res = await userService.getAllUsers()
  // console.log('ressss', res)
  return res
 }

  // const {data, isSuccess, isError} = mutationCreate
  const {data: dataUpdated, isSuccess: isSuccessUpdated, isError:isErrorUpdated} = mutationUpdate
  // console.log("mutationUpdate", mutationUpdate)
  const {data: dataDeleted,isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError:isErrorDeleted} = mutationDelete


  // const {data: products } = useQuery(['products'],getAllProduct)
  // const queryUser = useQuery({ queryKey: ['products'], queryFn: getAllProduct }) 
  const queryUser = useQuery(['users'],getAllUsers)
  const { data: users } = queryUser


  // console.log('products', products)
  const renderAction = () => {
    return (
      <div>
        <Button style={{ color: 'red', fontSize: '14px', cursor: 'pointer', marginRight:'5px' }} onClick={onDetailUser} >Chi tiết </Button>
        <Button style={{ color: 'red', fontSize: '14px', cursor: 'pointer', marginRight:'5px' }} onClick={() => setIsModalOpenDelete(true)} >Xóa </Button>
        <Button style={{ color: 'orange', fontSize: '14px', cursor: 'pointer' }} onClick={handleGetDetailUser} > Sửa</Button>
        {/* <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} /> */}
      </div>
    )
  }


const fetchGetDetailUser = async(rowSelected) => {
    const res = await userService.getDetailUser(rowSelected) //rowSelected: id user
    if(res?.data){
 

      setStateUserDetail({
        name: res?.data.name , 
        email : res?.data.email,
        isAdmin : res?.data.isAdmin,
        phone : res?.data.phone,
        address : res?.data.address,
        avatar : res?.data.avatar,
        city : res?.data.city,
        // sex : res?.data.sex,
      })
    }
}

useEffect(() =>{
  if(rowSelected){
    fetchGetDetailUser(rowSelected)
  }
}, [rowSelected])

// khi click vào nút chỉnh sửa => stateUserDetail thay đổi =>
// form.setFieldsValue: form set giá trị thay đổi thông tin trong form 
// những giá trị của name="" của Form.Item trùng với các state trong stateUserDetail  = vs giá trị của stateUserDetail
useEffect(()=> {
  form.setFieldsValue(stateUserDetail)
},[form, stateUserDetail])


// console.log("resProduct", stateUserDetail)


  const handleGetDetailUser = () =>{
    // if(rowSelected){
    //   fetchGetDetailUser()
    // }
    setIsOpenDrawer(true)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      // ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email - b.email,

    },
    {
      title: 'Admin ',
      dataIndex: 'isAdmin',
      // sorter: (a, b) => a.isAdmin - b.isAdmin,

    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      // filters: [
      //   {
      //     text: '>= 3',
      //     value: '>=',
      //   },
      //   {
      //     text: '<= 3',
      //     value: '<=',
      //   }
      // ],
      // onFilter: (value, record) => {
      //   if (value === '>=') {
      //     return Number(record.rating) >= 3
      //   }
      //   return Number(record.rating) <= 3
      // },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address - b.address,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  const dataTable = users?.data?.length && users?.data?.map((user) => {
    return { ...user, key: user._id, isAdmin: user.isAdmin ? "TRUE" : "FALSE"}
  })

  //nếu ấn nút submit tạo sản phẩm thành coogn thì sẽ tự động đóng cửa sổ , thống báo thành công
  // useEffect(()=> {
  //   if(isSuccess && data?.status === 'OK'){
  //     messagee.success()
  //     handleCancel()
  //   } else if(isError){
  //     messagee.error()
  //   }
  // },[isSuccess, isError])

  useEffect(()=> {
    if(isSuccessUpdated && dataUpdated?.status === 'OK'){
      messagee.success()
      handleCloseDrawer()
    } else if(isErrorUpdated){
      messagee.error()
    }
  },[isSuccessUpdated, isErrorUpdated])

  
  useEffect(()=> {
    if(isSuccessDeleted && dataDeleted?.status === 'OK'){
      messagee.success()
      // handleCloseDrawer()
    } else if(isErrorUpdated){
      messagee.error()
    }
  },[isSuccessDeleted, isErrorDeleted])

  // hàm xử lý khi thoát ra hỏi cửa sổ thêm sản phẩm
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   setStateProduct({
  //     name: "" , 
  //   image : "",
  //   type : "",
  //   priceOld : "",
  //   priceNew : "",
  //   rating : "",
  //   description : "",
  //   discount : "",
  //   selled : "",
  //   countInStock : "",
  //   })
  //   form.resetFields()
  // };

    //hàm xử lý khi thoát ra hỏi cửa sổ edit sản phẩm
    const handleCloseDrawer = () => {
      setIsOpenDrawer(false);
      setStateUserDetail({
      name: "" , 
      email : "",
      isAdmin : false,
      phone : "",
      address : "",
      avatar : "",
      city : "",
      // sex : "",
      })
      form.resetFields()
    };
  


  const handleOnChangeInputDetail = (e) =>{
    // console.log("e.target.value", e.target.value);
    // console.log("e.target.name", e.target.name);
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value
    })
}
    //up file  ảnh user

    const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

//   const handleChangeAvatar = async ({fileList}) => {
//     const file = fileList[0]
//     if (!file.url && !file.preview) {
//         file.preview = await getBase64(file.originFileObj );
//     }
//     setStateUser({
//       ...stateUser,
//       image: file.preview,
//     })
// }

const handleChangeAvatarDetail = async ({fileList}) => {
  const file = fileList[0]
  if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj );
  }
  setStateUserDetail({
    ...stateUserDetail,
    avatar: file.preview,
  })
}
// const onFinishSubmit =() =>{
//   console.log('onFinishSubmit',stateProduct )
//   mutationCreate.mutate(stateProduct, {
//     onSettled: () => {
//       queryUser.refetch()
//     }
//   })
// }

const onUpdateUser = () =>{
    mutationUpdate.mutate({id: rowSelected , ...stateUserDetail},{
      onSettled: () =>{
        queryUser.refetch()
      }
    })
}
// const onDetailProduct = () =>{
//   mutationDelete.mutate({id: rowSelected },{
//     onSettled: () =>{
//       queryUser.refetch()
//     }
//   })
// }

//hàm để hiển thị chi tiết sản phẩm 
const onDetailUser = () =>{
  //  console.log('GetDetailProduct', rowSelected)
  //  if(rowSelected){
  //   fetchGetDetailUser(rowSelected)
  // }
  setIsOpenDrawer2(true)
}

const handleCancelDelete = () => {
  setIsModalOpenDelete(false)
}

const handleDeleteProduct = () =>{
  mutationDelete.mutate({id: rowSelected },{
    onSettled: () =>{
      queryUser.refetch()
    }
  })
  setIsModalOpenDelete(false)

}


// console.log(access_token)
  return (
    <div>
      <div className={styles.headerUser}>Quản lý sản phẩm</div>
      {/* <Button className={styles.buttonAdd} onClick={() =>setIsModalOpen(true)}>Thêm sản phẩm mới</Button> */}

      <div style={{marginTop: "20px"}}>
        <TableComponent columns={columns} data={dataTable}  onRow={(record, rowIndex) => {//record:là dữ liệu của dòng đó trong table
          return {
            onClick: event => {
              setRowSelected(record._id)
            }, // click row
          };
        }}/>
      </div>
{/* //Drawer Update */}
      <DrawerComp title="Chi tiết người dùng" isOpen={isOpenDrawer} width="50%" onClose={() => setIsOpenDrawer(false)}>
        <Form
        name="basic"
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 17,
        }}
        onFinish={onUpdateUser}
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
          label="Email" name="email"
          rules={[{required: true, message: 'Please input your email!',},]}
        >
          <InputComponent value={stateUserDetail.type} name="email" onChange={handleOnChangeInputDetail} />
        </Form.Item>

        
        <Form.Item
          label="Admin"
          name="isAdmin"
          rules={[
            {
              required: true,
              message: 'Please input your isAdmin!',
            },
          ]}
        >
          <InputComponent value={stateUserDetail.isAdmin} name="isAdmin" onChange={handleOnChangeInputDetail} />
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
          label="Giới tính" name="sex" 
          rules={[{required: true,message: 'Please input your sex!',}]}
        >
          <InputComponent value={stateUserDetail.sex} name="sex" onChange={handleOnChangeInputDetail}/>
        </Form.Item> */}


        <Form.Item
          label="Ảnh" name="avatar" 
          rules={[{required: true,message: 'Please input your image!',}]}
        >
          <WrapperUploadFile onChange={handleChangeAvatarDetail} maxCount={1}>
                  <Button >Chọn ảnh</Button>
                  {stateUserDetail?.avatar && (
                      <img src={stateUserDetail?.avatar} style={{
                          height: '50px',
                          width: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginLeft: '10px',
                      }} alt="avatar"/>
                  )}
                </WrapperUploadFile>
        </Form.Item>

        

        <Form.Item
          wrapperCol={{
            offset: 20,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Apply
          </Button>
        </Form.Item>
        </Form>
      </DrawerComp>

{/* Drawer Detail */}
      <DrawerComp title="Chi tiết nguời dùng" isOpen={isOpenDrawer2} width="50%" onClose={() => setIsOpenDrawer2(false)}>
      <Form
        name="basic"
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 17,
        }}
        onFinish={onUpdateUser}
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
          <InputComponent value={stateUserDetail.name} name="name"  />
        </Form.Item>

        <Form.Item
          label="Email" name="email"
          rules={[{required: true, message: 'Please input your email!',},]}
        >
          <InputComponent value={stateUserDetail.type} name="email"  />
        </Form.Item>

        
        <Form.Item
          label="Admin"
          name="isAdmin"
          rules={[
            {
              required: true,
              message: 'Please input your isAdmin!',
            },
          ]}
        >
          <InputComponent value={stateUserDetail.isAdmin} name="isAdmin"  />
        </Form.Item>

        <Form.Item
          label="SĐT" name="phone" 
          rules={[{required: true,message: 'Please input your phone!',}]}
        >
          <InputComponent value={stateUserDetail.phone} name="phone" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ" name="address" 
          rules={[{required: true,message: 'Please input your address!',}]}
        >
          <InputComponent value={stateUserDetail.address} name="address" />
        </Form.Item>

        <Form.Item
          label="Nơi sống" name="city" 
          rules={[{required: true,message: 'Please input your city!',}]}
        >
          <InputComponent value={stateUserDetail.city} name="city" />
        </Form.Item>

        {/* <Form.Item
          label="Giới tính" name="sex" 
          rules={[{required: true,message: 'Please input your sex!',}]}
        >
          <InputComponent value={stateUserDetail.sex} name="sex" />
        </Form.Item> */}


        <Form.Item
          label="Ảnh" name="avatar" 
          rules={[{required: true,message: 'Please input your image!',}]}
        >
          <WrapperUploadFile onChange={handleChangeAvatarDetail} maxCount={1}>
                  <Button >Chọn ảnh</Button>
                  {stateUserDetail?.avatar && (
                      <img src={stateUserDetail?.avatar} style={{
                          height: '50px',
                          width: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginLeft: '10px',
                      }} alt="avatar"/>
                  )}
                </WrapperUploadFile>
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
      </DrawerComp>

      <Modal title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
        <LoadingComp isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </LoadingComp>
      </Modal>

    </div>
  );
};

export default UserInforAd;
