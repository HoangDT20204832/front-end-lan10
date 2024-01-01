import {
    Col, Row
  } from "antd";
  import React, { useEffect, useState } from "react";
  import styles from "./styles.module.css";

  import clsx from "clsx";

  
  const BankAccountComp = () => {
    return (
   
        <Col span={20} className={styles.container}>
          <div className={styles.containerHeader}>Thẻ Tín Dụng/Ghi Nợ</div>
          <Row>
          <Col span={14} className={styles.containerContent}>
            <div className={styles.containerContentLeft}>
              <div className={styles.containerContentLeftItem}>
                <span>Họ và tên chủ thẻ: </span>
                 <span>Dương Tiến Hoàng</span>
              </div>
              <div className={styles.containerContentLeftItem}>
                <span>Số điện thoại: </span>
                 <span>9847492211</span>
              </div> <div className={styles.containerContentLeftItem}>
                <span>Ngân hàng: </span>
                 <span>PayPal</span>
              </div>
              <div className={styles.containerContentLeftItem}>
                <span>Số thẻ:  </span>
                 <span>02620200536523</span>
              </div>
            </div>
  

          </Col>

          <Col span={10}>
            <img className={styles.containerContentImg} src= "https://chuyentiennhanh.org/wp-content/uploads/2019/03/the-paypal-la-gi.jpg" />
          </Col>
          </Row>
        
        </Col>
       
     
    );
  };
  
  export default BankAccountComp;
  