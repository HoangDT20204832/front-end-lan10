import React from "react";
import styles from "./styles.module.css";
import ProductDetailComp from "../../components/ProductDetailComp";
import WrapperRatingComp from "../../components/WrapperRatingComp";
import { useParams, useNavigate } from "react-router-dom";
const ProductPageDetail = () => {
    const {id} = useParams() // dùng để lấy được id trên thanh params của web
    const navigate = useNavigate()
    return (
        <div className={styles.wrapProductDetail}>
            <div className="grid">
            <h4><span onClick={() => navigate("/")}>Trang chủ</span>  Chi tiết sản phẩm</h4>
            <ProductDetailComp idProduct= {id} />
            {/* <WrapperRatingComp /> */}
            </div>
        
        </div>
    );
};

export default ProductPageDetail;
