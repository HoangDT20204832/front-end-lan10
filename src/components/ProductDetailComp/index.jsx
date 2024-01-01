import { Col, Image, Row, InputNumber, Rate } from "antd";
import styles from "./styles.module.css";
import { PlusOutlined, MinusOutlined, StarFilled } from "@ant-design/icons";
import ButtonComponent from "../ButtonComp/index";
import React, { useEffect, useState } from "react";
import * as productService from "../../services/ProductService";
import * as reviewService from "../../services/ReviewService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { format } from "date-fns";
import clsx from "clsx";
import LoadingComp from "../LoadingComp";
import * as messagee from "../MessageComp"
const ProductDetailComp = ({ idProduct }) => {
  const navigate = useNavigate();
  const location = useLocation(); //để lấy ra pathname trong location(đường dẫn của trang productdetail)
  //để khi chưa đăng nhập mà ấn vào thêm giỏ hàng thì đăng nhập vào phát tự động dẫn tới link sản phẩm mua luôn
  const dispatch = useDispatch();
  const [numberProductBye, setNumberProductBye] = useState(1);
  const [ratingPoint, setRatingPoint] = useState("");
  const [dataReviews, setDataReviews] = useState(null);
  const [hasImg, setHasImg] = useState("");
  const user = useSelector((state) => state.user);
  console.log("hi user: ", user);
  const [selectedNavItem, setSelectedNavItem] = useState("Tất cả"); // Thêm state mới

  const onChange = (value) => {
    setNumberProductBye(value);
  };
  const [loading, setLoading] = useState(false);

  const handleChangeCount = (type, limited) => {
    if (type === "decrease") {
      if (!limited) {
        setNumberProductBye(numberProductBye - 1);
      }
    } else if (type === "increase") {
      if (!limited) {
        setNumberProductBye(numberProductBye + 1);
      }
    }
  };
  const fetchGetDetailProduct = async (context) => {
    // console.log("context", context);
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await productService.getDetailProduct(id); //rowSelected: id sản phẩm
      // console.log("res", res)
      return res.data;
    }
  };

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname }); //truyền thêm state khi login
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetail?.name,
            amount: numberProductBye,
            image: productDetail?.image,
            priceOld: productDetail?.priceOld,
            priceNew: productDetail?.priceNew,
            discount: productDetail?.discount,
            product: productDetail?._id,
            countInStock: productDetail?.countInStock,
          },
        })
      );
      messagee.success("Thêm sản phẩm vào giỏ hàng thành công")
    }
  };

  const handleBuyOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname }); //truyền thêm state khi login
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetail?.name,
            amount: numberProductBye,
            image: productDetail?.image,
            priceOld: productDetail?.priceOld,
            priceNew: productDetail?.priceNew,
            discount: productDetail?.discount,
            product: productDetail?._id,
            countInStock: productDetail?.countInStock,
          },
        })
      );
      messagee.success("Thêm sản phẩm vào giỏ hàng thành công")

      navigate("/order");
    }
  };

  const { data: productDetail, isLoading } = useQuery(
    ["product-detail", idProduct],
    fetchGetDetailProduct,
    { enabled: !!idProduct }
  );
  // console.log("productDetail", productDetail);

  const fetchReviewProduct = async () => {
    setLoading(true);
    const res = await reviewService.getReviewsByProduct(
      idProduct,
      ratingPoint,
      hasImg
    );
    if (res.status === "OK") {
      setDataReviews(res.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
    // return res.data
  };
  // console.log("hello", dataReviews);

  useEffect(() => {
    fetchReviewProduct();
  }, [ratingPoint, hasImg]);

  const fetchReviewAllProduct = async (contex) => {
    const idProduct = contex?.queryKey[1];
    const res = await reviewService.getReviewsByProduct(
      idProduct,
      ratingPoint,
      hasImg
    );
    setDataReviews(res.data);

    return res.data;
  };
  const queryReiew = useQuery(["reviews", idProduct], fetchReviewAllProduct);
  const { data: dataReviewsAll } = queryReiew;
  // console.log("dataReviewAll", dataReviewsAll);

  // Tính trung bình rating
  const totalRating = dataReviewsAll?.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating = Number(
    (dataReviewsAll?.length > 0
      ? totalRating / dataReviewsAll?.length
      : 0
    ).toFixed(1)
  );
  return (
    <LoadingComp isLoading={isLoading}>
      <Row className={styles.wrapp}>
        <Col span={10} className={styles.wrapImgProduct}>
          <Image
            className={styles.imgBig}
            src={productDetail?.image}
            alt="img product"
            preview={false}
          />
          <Row className={styles.wrapImgsSmall}>
            <Col span={4} className={styles.imgSmall}>
              <Image
                src= "https://down-vn.img.susercontent.com/file/sg-11134201-22110-snojb4c74gkvbf" 
                alt="img small "
                preview={false}
              />
            </Col>
            <Col span={4} className={styles.imgSmall}>
              <Image
                src= "https://down-vn.img.susercontent.com/file/sg-11134201-22110-snojb4c74gkvbf" 
                alt="img small "
                preview={false}
              />
            </Col>
            <Col span={4} className={styles.imgSmall}>
              <Image
                src= "https://down-vn.img.susercontent.com/file/sg-11134201-22110-snojb4c74gkvbf" 
                alt="img small "
                preview={false}
              />
            </Col>
            <Col span={4} className={styles.imgSmall}>
              <Image
                src= "https://down-vn.img.susercontent.com/file/sg-11134201-22110-snojb4c74gkvbf" 
                alt="img small "
                preview={false}
              />
            </Col>
            <Col span={4} className={styles.imgSmall}>
              <Image
                src= "https://down-vn.img.susercontent.com/file/sg-11134201-22110-snojb4c74gkvbf" 
                alt="img small "
                preview={false}
              />
            </Col>
          </Row>
        </Col>

        <Col span={14} className={styles.productInfor}>
          <h1 className={styles.nameProduct}>{productDetail?.name}</h1>
          <div>
            {/* <StarFilled className={styles.star} /> */}
            <Rate allowHalf disabled defaultValue={5} value={averageRating} />
            <span className={styles.textSell}>
              {" "}
              | Đã bán {productDetail?.selled} sản phẩm
            </span>
          </div>
          <div className={styles.priceProduct}>
            <div className={styles.priceProductOld}>
              <h1 className={styles.priceTextProductOld}>
                {productDetail?.priceOld.toLocaleString()}
              </h1>
              <span>đ</span>
            </div>
            <div className={styles.priceProductNew}>
              <h1 className={styles.priceTextProductNew}>
                {productDetail?.priceNew.toLocaleString()}
              </h1>
              <span>đ</span>
            </div>
            <div className={styles.discoundProduct}>
              {productDetail?.discount}% GIẢM
            </div>
          </div>
          <div className={styles.addressProduct}>
            <span>Giao đến </span>
            <span className={styles.address}>{user?.address}</span> -
            <span className={styles.changeAddress}>Đổi địa chỉ</span>
          </div>
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px", fontSize: "16px" }}>
              Số lượng
            </div>
            <div className={styles.qualityProduct}>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleChangeCount("decrease", numberProductBye === 1)
                }
              >
                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
              <InputNumber
                className={styles.inputNumber}
                onChange={onChange}
                defaultValue={1}
                min={1}
                value={numberProductBye}
                size="small"
              />
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleChangeCount(
                    "increase",
                    numberProductBye === productDetail?.countInStock
                  )
                }
              >
                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
            </div>
            <div className={styles.quantityProductAvailable}>
              {productDetail?.countInStock}
              <span> sản phẩm có sẵn</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              aliggItems: "center",
              gap: "12px",
            }}
          >
            <div>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: "#fff",
                  height: "48px",
                  width: "220px",
                  border: "1px solid #ee4d2d",
                  borderRadius: "4px",
                }}
                onClick={handleAddOrderProduct}
                textbutton={"Thêm vào giỏ hàng"}
                styleTextButton={{
                  color: "#ee4d2d",
                  fontSize: "15px",
                  fontWeight: "400",
                }}
              ></ButtonComponent>
              {/* {errorLimitOrder && <div style={{color: 'red'}}>San pham het hang</div>} */}
            </div>
            <ButtonComponent
              size={40}
              onClick={handleBuyOrderProduct}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "220px",
                border: "none",
                borderRadius: "4px",
              }}
              textbutton={"Mua ngay"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
              }}
            ></ButtonComponent>
          </div>
        </Col>
      </Row>
      <div className={styles.wrapperProductRating}>
        <div className={styles.wrapperProductRatingHeader}>
          ĐÁNH GIÁ SẢN PHẨM
        </div>
        <div className={styles.wrapperProductRatingBody}>
          <div className={styles.productRatingOverview}>
            <div className={styles.productRatingOverviewMedium}>
              <div>
                <span className={styles.productRatingOverviewMediumDetail}>
                  {averageRating}
                </span>
                <span className={styles.productRatingOverview5}> trên 5</span>
              </div>
              <Rate
                style={{ fontSize: "16px", color: "var(--active-color)" }}
                allowHalf
                disabled
                defaultValue={5}
                value={averageRating}
              />
            </div>
            <div className={styles.productRatingOverviewList}>
              <div
                className={clsx(styles.buttonRating, {
                  [styles.active]: selectedNavItem === "Tất cả",
                })}
                onClick={() => {
                  setRatingPoint("");
                  setHasImg("");
                  setSelectedNavItem("Tất cả");
                }}
              >
                Tất cả
              </div>
              <div
                className={clsx(styles.buttonRating, {
                  [styles.active]: selectedNavItem === "5 Sao",
                })}
                onClick={() => {
                  setRatingPoint(5);
                  setHasImg("");
                  setSelectedNavItem("5 Sao");
                }}
              >
                5 Sao
              </div>{" "}
              <div
                className={clsx(styles.buttonRating, {
                  [styles.active]: selectedNavItem === "4 Sao",
                })}
                onClick={() => {
                  setRatingPoint(4);
                  setHasImg("");
                  setSelectedNavItem("4 Sao");
                }}
              >
                4 Sao
              </div>
              <div
                className={clsx(styles.buttonRating, {
                  [styles.active]: selectedNavItem === "3 Sao",
                })}
                onClick={() => {
                  setRatingPoint(3);
                  setHasImg("");
                  setSelectedNavItem("3 Sao");
                }}
              >
                3 Sao
              </div>
              <div
                className={clsx(styles.buttonRating, {
                  [styles.active]: selectedNavItem === "2 Sao",
                })}
                onClick={() => {
                  setRatingPoint(2);
                  setHasImg("");
                  setSelectedNavItem("2 Sao");
                }}
              >
                2 Sao
              </div>
              <div
                className={clsx(styles.buttonRating, {
                  [styles.active]: selectedNavItem === "1 Sao",
                })}
                onClick={() => {
                  setRatingPoint(1);
                  setHasImg("");
                  setSelectedNavItem("1 Sao");
                }}
              >
                1 Sao
              </div>
              <div
                className={clsx(styles.buttonRating, {
                  [styles.active]: selectedNavItem === "Có hình ảnh",
                })}
                onClick={() => {
                  setRatingPoint("");
                  setHasImg(true);
                  setSelectedNavItem("Có hình ảnh");
                }}
              >
                Có hình ảnh
              </div>
            </div>
          </div>
          <LoadingComp isLoading={loading}>
            <div className={styles.productRatingDetailsList}>
              {dataReviews?.map((dataReview) => {
                const createdAtDate = new Date(dataReview?.createdAt);
                return (
                <div className={styles.productRatingDetailsItem} key = {dataReview?._id} >
                    <div className={styles.productRatingDetailsHeader}>
                      <img src={dataReview?.userId?.avatar} />
                      <div>
                        <div>{dataReview?.userId?.name}</div>
                        <Rate
                          style={{
                            fontSize: "14px",
                            color: "var(--active-color)",
                          }}
                          allowHalf
                          disabled
                          defaultValue={5}
                          value={dataReview?.rating}
                        />
                      </div>
                    </div>
                    <div className={styles.productRatingDetailsBody}>
                      <div>
                        Thời gian đánh giá:
                        <span>{format(createdAtDate, "dd/MM/yyyy HH:mm")}</span>
                      </div>
                      <div>
                        Chất lượng sản phẩm:<span>đúng</span>
                      </div>
                      <div>
                        Đúng với mô tả: <span>OK</span>
                      </div>
                      <div>{dataReview?.comment}</div>
                      {dataReview?.images?.map((image) => (
                        <img
                          key={image._id}
                          src={image.imageUrl}
                          alt="Review"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </LoadingComp>
        </div>
      </div>
    </LoadingComp>
  );
};

export default ProductDetailComp;
