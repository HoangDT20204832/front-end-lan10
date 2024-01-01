import React from "react";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
const BadgeComp = () => {
  const order = useSelector((state) => state.order);
  const navigate = useNavigate()
  console.log("orderBadge", order);
  return (
    <div className={styles.headerCartList}>
      <img src="" alt="" className={styles.headerCartnocartimg} />
      <span className={styles.headerCartListnocartmsg}>Chưa có sản phẩm</span>

      <h4 className={styles.headerCartheading}>Sản phẩm trong giỏ hàng</h4>
      <ul className={styles.headerCartListitem}>

        {order?.orderItems?.map((orderItem, index) =>{
            return (
                <li key={index} onClick={()=> navigate(`/product-detail/${orderItem?.product}`)} className={styles.headerCartitem}>
                <img
                  src={orderItem?.image}
                  alt=""
                  className={styles.headerCartimg}
                />
                <div className={styles.headerCartiteminfo}>
                  <div className={styles.headerCartitemhead}>
                    <div className={styles.headerCartitemname}>
                      {" "}
                      {orderItem?.name}
                    </div>
                    <div className={styles.headerCartiteampricewrap}>
                      <span className={styles.headerCartitemprice}>{(orderItem?.priceNew)?.toLocaleString()}đ</span>
                      <span className={styles.headerCartiteammultiply}>x</span>
                      <span className={styles.headerCartitemqnt}>{orderItem?.amount }</span>
                    </div>
                  </div>
      
                  <div className={styles.headerCartitembody}>
                    <span className={styles.headerCartitemdescription}>
                      Số lượng còn lại: {orderItem?.countInStock}
                    </span>
                    {/* <span className={styles.headerCartitemremove}>Xóa</span> */}
                  </div>
                </div>
              </li>
            )
        })}
 
      </ul>

      <div onClick={() => navigate(`/order`)}  className={styles.headerCartviewcart}>
        Xem giỏ hàng
      </div>
    </div>
  );
};

export default BadgeComp;
