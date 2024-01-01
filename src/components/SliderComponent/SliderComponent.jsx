import React from 'react'
import {Image, Row, Col} from "antd"
import styles from "./styles.module.css"
import {SliderImg} from "./styles"
const SliderComponent = ({arrImages}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <Row style={{paddingTop:"20px"}}>
    <Col span={16} >
    <SliderImg {...settings} className={styles.sliderImg}>
      {arrImages.map(img =>{
        return (
          <Image src={img} key= {img} alt="slider" style={{height: "calc(width /3);"}}/>
        )
      })}
     </SliderImg>
    </Col>
    <Col span={8} className={styles.wrapperImg}>
      <Image className={styles.imgNextToSlider}  src= "https://cf.shopee.vn/file/vn-50009109-0949ec209e4bf197a9b67c98f3e2172c_xhdpi" />
      <Image className={styles.imgNextToSlider} src= "https://cf.shopee.vn/file/vn-50009109-0949ec209e4bf197a9b67c98f3e2172c_xhdpi" />
    </Col>
  </Row>


  )
}

export default SliderComponent