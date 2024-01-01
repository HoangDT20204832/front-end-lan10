import React from "react";
// import "./styles.css";
import { Col, Rate } from "antd";
import styles from "./styles.module.css"
import clsx from "clsx";
import {useNavigate} from "react-router-dom"
const CardProductComp = (props) => {
  const {countInStock,description,discount,image,name, priceOld,priceNew,rating,selled,
    trademark, origin, type ,id} = props;

  const navigate = useNavigate()
  const handleDetailProduct = (id) =>{
    navigate(`/product-detail/${id}`)
  }

  return (

        <Col span={4} className={styles.cardProductWrap} 
             onClick={() => countInStock!== 0 && handleDetailProduct(id)}
              >         
          <div className={styles.productItemWrap} 
            style={{backgroundColor: countInStock ===0 ? "#ccc" : "#fff" }} >
            <img className={styles.productItemImg} src= {image} />
            <h4 className={styles.productItemName}>
              {name}
            </h4>
            <div className={styles.productItemPrice}>
              <span className={styles.productItemPriceOld}>{priceOld?.toLocaleString()}đ</span>
              <span className={styles.productItemPriceCurrent}>{priceNew?.toLocaleString()}đ</span>
            </div>
            <div className={styles.productItemAction}>
              <div className={styles.productItemRating}>
                <Rate className={styles.productItemStar} allowHalf disabled  defaultValue={5} value={rating} 
                  />
               
              </div>
              <span className={styles.productItemSold}>{selled} Đã bán</span>
            </div>

            <div className={styles.productItemOrigin}>
              <span className={styles.productItemBrand}>{trademark ||"Xmass" }</span>
              <div className={styles.productItemOriginName}>{origin || "Việt Nam"}</div>
            </div>
            <div className={styles.productItemFavourite}>
              <i className={clsx(styles.fasolid, styles.facheck)}></i>
              <span>Yêu thích</span>
            </div>
            <div className={styles.productItemSaleOff}>
              <div className={styles.productItemSaleOffPercent}>{discount}%</div>
              <div className={styles.productItemSaleOffLabel}>GIẢM</div>
            </div>
          </div>
        </Col>     
 

  );
};

export default CardProductComp;
