import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button,  Modal,Form} from 'antd';
import TableComponent from "../TableComp/index";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperUploadFile } from "../AccountComp/styles";
import * as productService from "../../services/ProductService"
import {useMutationHooks} from "../../hooks/useMutationHook"
import * as messagee from "../../components/MessageComp"
import {useQuery} from "@tanstack/react-query"
import DrawerComp from "../DrawerComp";
import {useSelector} from "react-redux"
import LoadingComp from "../LoadingComp";


const ProductInForAd = () => {
  const user = useSelector((state) => state?.user)
const [rowSelected,setRowSelected] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)


  const inittial= () =>({
    name: "" , 
    image : "",
    type : "",
    priceOld : "",
    priceNew : "",
    rating : "",
    description : "",
    discount : "",
    selled : "",
    countInStock : "",
    trademark: "",
    origin: ""
  })
  const [stateProduct, setStateProduct] = useState(inittial())

  const [stateProductDetail, setStateProductDetail] = useState(inittial())

  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isOpenDrawer2, setIsOpenDrawer2] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)

  const [form] = Form.useForm()

  const mutationCreate = useMutationHooks(
    ( data) =>{ 
      const {   name , image ,type ,priceOld ,priceNew ,countInStock,rating ,
      description ,discount ,selled,trademark, origin } = data;
      // console.log("test datta", data)
      const res = productService.createProduct({name , image ,type ,priceOld ,priceNew ,countInStock ,rating ,
        description ,discount ,selled,trademark, origin })
      return res
      }
 )
 const mutationUpdate = useMutationHooks(
  ( data) =>{ 
    const {id ,  ...rest } = data;
    // console.log("test datta", data)
    const res = productService.updateProductInfor(id, {...rest} )
    return res
    },
)

const mutationDelete = useMutationHooks(
  ( data) =>{ 
    const {id ,  ...rest } = data;
    // console.log("test datta delete", data)
    const res = productService.deleteProductInfor(id, {...rest} )
    return res
    },
)

 // hàm lấy toàn bộ thông tin sản phẩm
 const getAllProduct = async() =>{
  const res = await productService.getAllProducts()
  // console.log('ressss', res)
  return res
 }

  const {data, isSuccess, isError} = mutationCreate
  const {data: dataUpdated, isSuccess: isSuccessUpdated, isError:isErrorUpdated} = mutationUpdate
  // console.log("mutationUpdate", mutationUpdate)
  const {data: dataDeleted,isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError:isErrorDeleted} = mutationDelete


  // const {data: products } = useQuery(['products'],getAllProduct)
  // const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct }) 
  const queryProduct = useQuery(['products'],getAllProduct)
  const { data: products } = queryProduct


  // console.log('products', products)
  const renderAction = () => {
    return (
      <div>
        <Button style={{ color: 'red', fontSize: '14px', cursor: 'pointer', marginRight:'5px' }} onClick={onDetailProduct} >Chi tiết </Button>
        <Button style={{ color: 'red', fontSize: '14px', cursor: 'pointer', marginRight:'5px' }} onClick={() => setIsModalOpenDelete(true)} >Xóa </Button>
        <Button style={{ color: 'orange', fontSize: '14px', cursor: 'pointer' }} onClick={handleGetDetailProduct} > Sửa</Button>
        {/* <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} /> */}
      </div>
    )
  }


const fetchGetDetailProduct = async(rowSelected) => {
    const res = await productService.getDetailProduct(rowSelected) //rowSelected: id sản phẩm
    // console.log("res", res)
    if(res?.data){
      setStateProductDetail({
        name: res?.data.name , 
        image : res?.data.image,
        type : res?.data.type,
        priceOld : res?.data.priceOld,
        priceNew : res?.data.priceNew,
        rating : res?.data.rating,
        description : res?.data.description,
        discount : res?.data.discount,
        selled : res?.data.selled,
        countInStock : res?.data.countInStock,
        trademark: res?.data.trademark,
        origin: res?.data.origin 
      })
    }
}

// console.log("heli", stateProductDetail)


useEffect(() =>{
  if(rowSelected){
    fetchGetDetailProduct(rowSelected)
  }
}, [rowSelected])

// khi click vào nút chỉnh sửa => stateProductDetail thay đổi =>
// form.setFieldsValue: form set giá trị thay đổi thông tin trong form 
// những giá trị của name="" của Form.Item trùng với các state trong stateProductDetail  = vs giá trị của stateProductDetail
useEffect(()=> {
  if(!isModalOpen){
    form.setFieldsValue(stateProductDetail)
  }else{
    form.setFieldsValue(inittial())
  }
},[form, stateProductDetail,isModalOpen])


// console.log("resProduct", stateProductDetail)


  const handleGetDetailProduct = () =>{
    // console.log('GetDetailProduct', rowSelected)
    // if(rowSelected){

    //   fetchGetDetailProduct(rowSelected)
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
      title: 'Giá mới',
      dataIndex: 'priceNew',
      sorter: (a, b) => a.priceNew - b.priceNew,

    },
    {
      title: 'Số lượng ',
      dataIndex: 'countInStock',
      sorter: (a, b) => a.countInStock - b.countInStock,

    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
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
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id }
  })

  //nếu ấn nút submit tạo sản phẩm thành coogn thì sẽ tự động đóng cửa sổ , thống báo thành công
  useEffect(()=> {
    if(isSuccess && data?.status === 'OK'){
      messagee.success()
      handleCancel()
    } else if(isError){
      messagee.error()
    }
  },[isSuccess, isError])

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

  //hàm xử lý khi thoát ra hỏi cửa sổ thêm sản phẩm
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "" , 
    image : "",
    type : "",
    priceOld : "",
    priceNew : "",
    rating : "",
    description : "",
    discount : "",
    selled : "",
    countInStock : "",
    trademark: "",
    origin: ""
    })
    form.resetFields()
  };

    //hàm xử lý khi thoát ra hỏi cửa sổ thêm sản phẩm
    const handleCloseDrawer = () => {
      setIsOpenDrawer(false);
      setStateProductDetail({
        name: "" , 
      image : "",
      type : "",
      priceOld : "",
      priceNew : "",
      rating : "",
      description : "",
      discount : "",
      selled : "",
      countInStock : "",
      trademark: "",
      origin: ""
      })
      form.resetFields()
    };
  
  const handleOnChangeInput = (e) =>{
      // console.log("e.target.value", e.target.value);
      // console.log("e.target.name", e.target.name);
      setStateProduct({
        ...stateProduct,
        [e.target.name]: e.target.value
      })
  }

  const handleOnChangeInputDetail = (e) =>{
    // console.log("e.target.value", e.target.value);
    // console.log("e.target.name", e.target.name);
    setStateProductDetail({
      ...stateProductDetail,
      [e.target.name]: e.target.value
    })
}
    //up file  ảnh sabr phẩm

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
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    })
}

const handleChangeAvatarDetail = async ({fileList}) => {
  const file = fileList[0]
  if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj );
  }
  setStateProductDetail({
    ...stateProductDetail,
    image: file.preview,
  })
}

const onFinishSubmit =() =>{
  // console.log('onFinishSubmit',stateProduct )
  mutationCreate.mutate(stateProduct, {
    onSettled: () => {
      queryProduct.refetch()
    }
  })
}

const onUpdateProduct = () =>{
    mutationUpdate.mutate({id: rowSelected , ...stateProductDetail},{
      onSettled: () =>{
        queryProduct.refetch()
      }
    })
}
// const onDetailProduct = () =>{
//   mutationDelete.mutate({id: rowSelected },{
//     onSettled: () =>{
//       queryProduct.refetch()
//     }
//   })
// }

//hàm để hiển thị chi tiết sản phẩm 
const onDetailProduct = () =>{
  //  console.log('GetDetailProduct', rowSelected)
  //  if(rowSelected){
  //   fetchGetDetailProduct(rowSelected)
  // }
  setIsOpenDrawer2(true)
}

const handleCancelDelete = () => {
  setIsModalOpenDelete(false)
}

const handleDeleteProduct = () =>{

  mutationDelete.mutate({id: rowSelected },{
    onSettled: () =>{
      queryProduct.refetch()
    }
  })
  setIsModalOpenDelete(false)

 }



// console.log(access_token)
  return (
    <div>
      <div className={styles.headerUser}>Quản lý sản phẩm</div>
      <Button className={styles.buttonAdd} onClick={() =>setIsModalOpen(true)}>Thêm sản phẩm mới</Button>

      <div style={{marginTop: "20px"}}>
        <TableComponent columns={columns} data={dataTable}  onRow={(record, rowIndex) => {//record:là dữ liệu của dòng đó trong table
          return {
            onClick: event => {
              setRowSelected(record._id)
            }, // click row
          };
        }}/>
      </div>

      <Modal forceRender title="Tạo sản phẩm" open={isModalOpen}  onCancel={handleCancel} footer={null}>
        <Form
        name="basic"
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 17,
        }}
        onFinish={onFinishSubmit}
        autoComplete="on"
        form={form}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
        >
          <InputComponent value={stateProduct.name} name="name" onChange={handleOnChangeInput} />
        </Form.Item>

        <Form.Item
          label="Loại sản phẩm" name="type"
          rules={[{required: true, message: 'Please input your type!',},]}
        >
          <InputComponent value={stateProduct.type} name="type" onChange={handleOnChangeInput} />
        </Form.Item>

        
        <Form.Item
          label="Giá cũ"
          name="priceOld"
          rules={[
            {
              required: true,
              message: 'Please input your priceOld!',
            },
          ]}
        >
          <InputComponent value={stateProduct.priceOld} name="priceOld" onChange={handleOnChangeInput} />
        </Form.Item>

        <Form.Item
          label="Giá mới" name="priceNew" 
          rules={[{required: true,message: 'Please input your priceNew!',}]}
        >
          <InputComponent value={stateProduct.priceNew} name="priceNew" onChange={handleOnChangeInput}/>
        </Form.Item>

        <Form.Item
          label="Số lượng còn lại" name="countInStock" 
          rules={[{required: true,message: 'Please input your countInStock!',}]}
        >
          <InputComponent value={stateProduct.countInStock} name="countInStock" onChange={handleOnChangeInput}/>
        </Form.Item>

        <Form.Item
          label="Đánh giá" name="rating" 
          rules={[{required: true,message: 'Please input your rating!',}]}
        >
          <InputComponent value={stateProduct.rating} name="rating" onChange={handleOnChangeInput}/>
        </Form.Item>

        <Form.Item
          label="Giảm giá %" name="discount" 
          rules={[{required: true,message: 'Please input your discount!',}]}
        >
          <InputComponent value={stateProduct.discount} name="discount" onChange={handleOnChangeInput}/>
        </Form.Item>

        <Form.Item
          label="Số lượng đã bán" name="selled" 
          rules={[{required: true,message: 'Please input your selled!',}]}
        >
          <InputComponent value={stateProduct.selled} name="selled" onChange={handleOnChangeInput} />
        </Form.Item>

        <Form.Item
          label="Thương hiệu" name="trademark" 
          rules={[{required: true,message: 'Please input your trademark!',}]}
        >
          <InputComponent value={stateProduct.trademark} name="trademark" onChange={handleOnChangeInput} />
        </Form.Item>

        <Form.Item
          label="Nơi xuất xứ" name="origin" 
          rules={[{required: true,message: 'Please input your origin!',}]}
        >
          <InputComponent value={stateProduct.origin} name="origin" onChange={handleOnChangeInput} />
        </Form.Item>

        <Form.Item
          label="Mô tả sản phẩm" name="description" 
          rules={[{required: true,message: 'Please input your description!',}]}
        >
          <InputComponent value={stateProduct.description} name="description" onChange={handleOnChangeInput} />
        </Form.Item>

        <Form.Item
          label="Ảnh" name="image" 
          rules={[{required: true,message: 'Please input your image!',}]}
        >
          <WrapperUploadFile onChange={handleChangeAvatar} maxCount={1}>
                  <Button >Chọn ảnh</Button>
                  {stateProduct?.image && (
                      <img src={stateProduct?.image} style={{
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
            Submit
          </Button>
        </Form.Item>
        </Form>
      </Modal>
{/* //Drawer Update */}
      <DrawerComp title="Chi tiết sản phẩm" isOpen={isOpenDrawer} width="50%" onClose={() => setIsOpenDrawer(false)}>
        <Form
        name="basic"
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 17,
        }}
        onFinish={onUpdateProduct}
        autoComplete="on"
        form={form}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
        >
          <InputComponent value={stateProductDetail.name} name="name" onChange={handleOnChangeInputDetail} />
        </Form.Item>

        <Form.Item
          label="Loại sản phẩm" name="type"
          rules={[{required: true, message: 'Please input your type!',},]}
        >
          <InputComponent value={stateProductDetail.type} name="type" onChange={handleOnChangeInputDetail} />
        </Form.Item>

        
        <Form.Item
          label="Giá cũ"
          name="priceOld"
          rules={[
            {
              required: true,
              message: 'Please input your priceOld!',
            },
          ]}
        >
          <InputComponent value={stateProductDetail.priceOld} name="priceOld" onChange={handleOnChangeInputDetail} />
        </Form.Item>

        <Form.Item
          label="Giá mới" name="priceNew" 
          rules={[{required: true,message: 'Please input your priceNew!',}]}
        >
          <InputComponent value={stateProductDetail.priceNew} name="priceNew" onChange={handleOnChangeInputDetail}/>
        </Form.Item>

        <Form.Item
          label="Số lượng còn lại" name="countInStock" 
          rules={[{required: true,message: 'Please input your countInStock!',}]}
        >
          <InputComponent value={stateProductDetail.countInStock} name="countInStock" onChange={handleOnChangeInputDetail}/>
        </Form.Item>

        <Form.Item
          label="Đánh giá" name="rating" 
          rules={[{required: true,message: 'Please input your rating!',}]}
        >
          <InputComponent value={stateProductDetail.rating} name="rating" onChange={handleOnChangeInputDetail}/>
        </Form.Item>

        <Form.Item
          label="Giảm giá %" name="discount" 
          rules={[{required: true,message: 'Please input your discount!',}]}
        >
          <InputComponent value={stateProductDetail.discount} name="discount" onChange={handleOnChangeInputDetail}/>
        </Form.Item>

        <Form.Item
          label="Số lượng đã bán" name="selled" 
          rules={[{required: true,message: 'Please input your selled!',}]}
        >
          <InputComponent value={stateProductDetail.selled} name="selled" onChange={handleOnChangeInputDetail} />
        </Form.Item>

        <Form.Item
          label="Thương hiệu" name="trademark" 
          rules={[{required: true,message: 'Please input your trademark!',}]}
        >
          <InputComponent value={stateProductDetail.trademark} name="trademark" onChange={handleOnChangeInputDetail} />
        </Form.Item>

        <Form.Item
          label="Nơi xuất xứ" name="origin" 
          rules={[{required: true,message: 'Please input your origin!',}]}
        >
          <InputComponent value={stateProductDetail.origin} name="origin" onChange={handleOnChangeInputDetail} />
        </Form.Item>

        <Form.Item
          label="Mô tả sản phẩm" name="description" 
          rules={[{required: true,message: 'Please input your description!',}]}
        >
          <InputComponent value={stateProductDetail.description} name="description" onChange={handleOnChangeInputDetail} />
        </Form.Item>

        <Form.Item
          label="Ảnh" name="image" 
          rules={[{required: true,message: 'Please input your image!',}]}
        >
          <WrapperUploadFile onChange={handleChangeAvatarDetail} maxCount={1}>
                  <Button >Chọn ảnh</Button>
                  {stateProductDetail?.image && (
                      <img src={stateProductDetail?.image} style={{
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
      <DrawerComp title="Chi tiết sản phẩm" isOpen={isOpenDrawer2} width="50%" onClose={() => setIsOpenDrawer2(false)}>
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
          label="Tên sản phẩm"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
        >
          <InputComponent value={stateProductDetail.name} name="name"  />
        </Form.Item>

        <Form.Item
          label="Loại sản phẩm" name="type"
          rules={[{required: true, message: 'Please input your type!',},]}
        >
          <InputComponent value={stateProductDetail.type} name="type"  />
        </Form.Item>

        
        <Form.Item
          label="Giá cũ"
          name="priceOld"
          rules={[
            {
              required: true,
              message: 'Please input your priceOld!',
            },
          ]}
        >
          <InputComponent value={stateProductDetail.priceOld} name="priceOld"  />
        </Form.Item>

        <Form.Item
          label="Giá mới" name="priceNew" 
          rules={[{required: true,message: 'Please input your priceNew!',}]}
        >
          <InputComponent value={stateProductDetail.priceNew} name="priceNew" />
        </Form.Item>

        <Form.Item
          label="Số lượng còn lại" name="countInStock" 
          rules={[{required: true,message: 'Please input your countInStock!',}]}
        >
          <InputComponent value={stateProductDetail.countInStock} name="countInStock" />
        </Form.Item>

        <Form.Item
          label="Đánh giá" name="rating" 
          rules={[{required: true,message: 'Please input your rating!',}]}
        >
          <InputComponent value={stateProductDetail.rating} name="rating" />
        </Form.Item>

        <Form.Item
          label="Giảm giá %" name="discount" 
          rules={[{required: true,message: 'Please input your discount!',}]}
        >
          <InputComponent value={stateProductDetail.discount} name="discount" />
        </Form.Item>

        <Form.Item
          label="Số lượng đã bán" name="selled" 
          rules={[{required: true,message: 'Please input your selled!',}]}
        >
          <InputComponent value={stateProductDetail.selled} name="selled"  />
        </Form.Item>

        <Form.Item
          label="Thương hiệu" name="trademark" 
          rules={[{required: true,message: 'Please input your trademark!',}]}
        >
          <InputComponent value={stateProductDetail.trademark} name="trademark"  />
        </Form.Item>

        <Form.Item
          label="Nơi xuất xứ" name="origin" 
          rules={[{required: true,message: 'Please input your origin!',}]}
        >
          <InputComponent value={stateProductDetail.origin} name="origin" />
        </Form.Item>

        <Form.Item
          label="Mô tả sản phẩm" name="description" 
          rules={[{required: true,message: 'Please input your description!',}]}
        >
          <InputComponent value={stateProductDetail.description} name="description"  />
        </Form.Item>

        <Form.Item
          label="Ảnh" name="image" 
          rules={[{required: true,message: 'Please input your image!',}]}
        >
          <WrapperUploadFile onChange={handleChangeAvatarDetail} maxCount={1}>
                  <Button >Chọn ảnh</Button>
                  {stateProductDetail?.image && (
                      <img src={stateProductDetail?.image} style={{
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
          {/* <Button type="primary" htmlType="submit">
            Apply
          </Button> */}
        </Form.Item>
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

export default ProductInForAd;
