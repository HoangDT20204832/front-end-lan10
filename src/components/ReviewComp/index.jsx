// src/components/ReviewComponent.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewService from '../../services/ReviewService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import styles from "./styles.module.css"
import {  Rate, Space,Button, Modal } from "antd";
import * as messagee from '../MessageComp/index'
import { WrapperUploadFile } from './styles';
import { updateIdsOrderReviewed } from "../../redux/slides/orderSlide";


const ReviewComponent = ({ orderReview, onClose }) => {
  const productReview = orderReview?.orderItems[0]
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  // console.log("userReview", user)
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const desc = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời'];

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const mutationCreate = useMutationHooks(
    ( data) =>{ 
    //   const {id, ...rest} = data;
      // console.log("test datta", data)
      const res = reviewService.createReview(data)
      return res
    }
 )
     const {data: dataReview} = mutationCreate
    //  console.log("dataReview1", dataReview)

     useEffect(() =>{
      if(dataReview?.status==="OK"){
        messagee.success("Đánh giá thành công")
        
        // onhandleReview((prevReviewedOrders) => [
        //   ...prevReviewedOrders,
        //   orderReview?._id,
        // ])
        dispatch(updateIdsOrderReviewed(orderReview?._id))
          
      }
     }, [dataReview?.status])

  const handleReviewSubmit = async () => {
    mutationCreate.mutate({ 
       userId: user?.id,productId: productReview?.product,rating,comment,
       images: fileList?.map((image)=>({
        imageUrl: image?.thumbUrl
       }))
    });
    
    setTimeout(()=>{
      onClose()
    },1000)
  };

  const handleCloseModal=  ()=> {
    onClose();
  }

//up file  ảnh sabr phẩm


const getBase64 = (file) =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});
  const handleCancel = () => setPreviewOpen(false);
const handlePreviewAvartar = async (file) => {
// const file = fileList[0]
if (!file.url && !file.preview) {
  file.preview = await getBase64(file.originFileObj );
}
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
}

const handleChangeAvatar =({ fileList: newFileList }) => setFileList(newFileList)

// console.log("fileImg", fileList)
  return (     
        <div className={styles.wrapperReview}>
          <div className={styles.reviewHeader}>Đánh giá sản phẩm</div>
          <div className={styles.reviewBody}>
            <div className={styles.reviewBodyProduct}>
              <img className={styles.reviewBodyProductImg} src={productReview?.image}/>
              <div className={styles.reviewBodyProductDescription}>
                    {productReview?.name}         
              </div>
            </div>
            <div className={styles.reviewBodyReview}>
              <label>Chất lượng sản phẩm</label>
              {/* <input type="number" min="1" max="5" value={rating} onChange={handleRatingChange} /> */}
              
              <Space>
              <Rate className={styles.reviewBodyReviewStart} tooltips={desc} 
                    defaultValue= {rating} value={rating} 
                 onChange={handleRatingChange} 
                 />
                 {rating ? <span>{desc[rating - 1]}</span> : ''}
              </Space>
            
            </div>
            <div className={styles.reviewBodyComment}>
              <div>Bình luận:</div>
              <textarea className={styles.reviewBodyCommentItem} value={comment} onChange={handleCommentChange} />
            </div>


          </div>
          <WrapperUploadFile
          listType="picture-card"
          onPreview={handlePreviewAvartar} onChange={handleChangeAvatar} fileList={fileList} >
                  <Button style={{marginLeft:"10px"}}>Tải ảnh</Button>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                      <img
                      alt="example"
                      style={{
                        width: '100%',
                      }}
                      src={previewImage}
                    />
                    </Modal>
                    
            </WrapperUploadFile>
      
        
          <div className={styles.reviewFotter}>
            <div onClick={handleCloseModal}>Trở lại</div>
            <div onClick={handleReviewSubmit}>Hoàn thành</div>
          </div>
        </div>
  );
};

export default ReviewComponent;


