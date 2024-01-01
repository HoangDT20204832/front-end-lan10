import React from "react";
import styles from "./styles.module.css";
import {useLocation} from "react-router-dom"
import { orderContant } from "../../contant";

const OrderSuccess = () => {
  const location = useLocation()
  // const order = useSelector((state) => state.order);
  const {state} = location

  return (
    <div className="grid">
      {/* <div>OrderSuccess</div> */}
      <div className={styles.cartCompWrap}>
        
        <div className={styles.cartComp}>
          <div className={styles.headerCart}>
            {/* <div className={styles.headerCartItem}>SHOP BÁN HÀNG</div> */}
            <div className={styles.headerCartItem}>ĐƠN HÀNG ĐÃ ĐẶT HÀNG THÀNH CÔNG</div>
          </div>
          <div className={styles.containerCart}>
            <div className={styles.containerCartLeft}>
            <div className={styles.containerCartLeftWrapperInfo}>
                <div>
                  <div className={styles.containerCartLeftLable}> Phương thức giao hàng</div>
                    <div className={styles.containerCartLeftValue} >
                      <span style={{color: '#ea8500', fontWeight: 'bold'}}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                    </div>              
                </div>
              </div>
              <div className={styles.containerCartLeftWrapperInfo}>
                <div>
                  <div className={styles.containerCartLeftLable}>Phương thức thanh toán</div>
                  <div className={styles.containerCartLeftValue}> 
                    {orderContant.payment[state?.payment]}
                  </div>
                </div>
              </div>

              <div className={styles.containerCartLeftWrapperInfo}>
                {state?.orders?.map((order,index) =>{
                    return (
                      <div key={index} className={styles.containerCartLeftItem} >
                      <div style={{width: '350px', display: 'flex', alignItems: 'center', gap: 4}}> 
                        <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                        <div className={styles.containerCartName}>{order?.name}</div>
                      </div>
                      <div className={styles.containerCartWrapPrice} >
                        <span className={styles.containerCartUnitPrice}>
                          <span className={styles.containerCartUnitPriceOld} >{order?.priceOld?.toLocaleString()}đ</span>
                          <span className={styles.containerCartUnitPriceNew} >{order?.priceNew?.toLocaleString()}đ</span>
                          <div className={styles.containerCartDiscount} >Giảm giá {order?.discount}%</div>
                        </span>
                        <div className={styles.containerCartLeftCount}>
                            Số lượng: {order?.amount}
                        </div>
                        <span className={styles.containerCartLeftPrices} >
                          Tổng tiền: {(order?.priceNew * order?.amount)?.toLocaleString()}đ</span>
                      </div>
                    </div>
                    )
                })}
            
              </div>

              <div className={styles.containerCartLeftWrapperInfo} 
                style={{color:"var(--active-color)", background:"var(--primary-color)", marginTop:"10px", borderRadius:"5px"}}>
                Tổng tất cả sản phẩm:{(state?.totalPriceMemo)?.toLocaleString()}đ
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
