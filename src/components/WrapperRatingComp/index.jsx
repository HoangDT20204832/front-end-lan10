import React from "react";
import styles from "./styles.module.css";
import {Rate} from "antd"
import ButtonComponent from "../ButtonComp/index";
const WrapperRatingComp = () => {
  return (
    <div className={styles.wrapperProductRating}>
      <div className={styles.wrapperProductRatingHeader}>ĐÁNH GIÁ SẢN PHẨM</div>
      <div className={styles.wrapperProductRatingBody}>
        <div className={styles.productRatingOverview}>
          <div className={styles.productRatingOverviewMedium}>
            <div>
              <span className={styles.productRatingOverviewMediumDetail}>4.5</span>
              <span className={styles.productRatingOverview5}>trên 5</span>
            </div>
            <Rate style={{ fontSize: "12px" }} disabled defaultValue={4} />
          </div>
          <div className={styles.productRatingOverviewList}>
            <ButtonComponent
                  size={40}
                  styleButton={{
                      background: "#fff",
                      height: "35px",
                      width: "105px",
                      border: "1px solid var(--background-color)",
                      borderRadius: "4px",
                  }}
                  textbutton={"Tất cả"}
                  styleTextButton={{
                      color: "var(--text-color)",
                      fontSize: "15px",
                      fontWeight: "400",
                  }} />
                 <ButtonComponent
                  size={40}
                  styleButton={{
                      background: "#fff",
                      height: "35px",
                      width: "105px",
                      border: "1px solid var(--background-color)",
                      borderRadius: "4px",
                  }}
                  textbutton={"5 Sao"}
                  styleTextButton={{
                      color: "var(--text-color)",
                      fontSize: "15px",
                      fontWeight: "400",
                  }} /> <ButtonComponent
                  size={40}
                  styleButton={{
                      background: "#fff",
                      height: "35px",
                      width: "105px",
                      border: "1px solid var(--background-color)",
                      borderRadius: "4px",
                  }}
                  textbutton={"4 Sao"}
                  styleTextButton={{
                      color: "var(--text-color)",
                      fontSize: "15px",
                      fontWeight: "400",
                  }} /> 
                  <ButtonComponent
                  size={40}
                  styleButton={{
                      background: "#fff",
                      height: "35px",
                      width: "105px",
                      border: "1px solid var(--background-color)",
                      borderRadius: "4px",
                  }}
                  textbutton={"3 Sao"}
                  styleTextButton={{
                      color: "var(--text-color)",
                      fontSize: "15px",
                      fontWeight: "400",
                  }} /> 
                  <ButtonComponent
                  size={40}
                  styleButton={{
                      background: "#fff",
                      height: "35px",
                      width: "105px",
                      border: "1px solid var(--background-color)",
                      borderRadius: "4px",
                  }}
                  textbutton={"2 Sao"}
                  styleTextButton={{
                      color: "var(--text-color)",
                      fontSize: "15px",
                      fontWeight: "400",
                  }} />
                   <ButtonComponent
                  size={40}
                  styleButton={{
                      background: "#fff",
                      height: "35px",
                      width: "105px",
                      border: "1px solid var(--background-color)",
                      borderRadius: "4px",
                  }}
                  textbutton={"1 Sao"}
                  styleTextButton={{
                      color: "var(--text-color)",
                      fontSize: "15px",
                      fontWeight: "400",
                  }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrapperRatingComp;
