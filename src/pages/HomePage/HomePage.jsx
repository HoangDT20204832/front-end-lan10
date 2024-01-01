import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperHeadingProduct,
  WrapperListProduct,
  WrapperProduct,
} from "./styles";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider_1 from "../../assets/img/slider_1.jpg";
import slider_2 from "../../assets/img/slider_2.jpg";
import slider_3 from "../../assets/img/slider_3.jpg";
import slider_4 from "../../assets/img/slider_4.jpg";
import CardProductComp from "../../components/CardProductComp";
import { Pagination, Row } from "antd";
import { useQuery } from "@tanstack/react-query";
import * as productService from "../../services/ProductService";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import LoadingComp from "../../components/LoadingComp";

const HomePage = () => {
  

  const productSearch = useSelector((state) => state.product.search);
  // const refSearch = useRef()
  // const [stateProduct, setStateProduct] = useState([])
  const searchDebounce = useDebounce(productSearch, 300);
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [typeProduct, setTypeProduct] = useState([]);
  const onChange = (current, pageSize) => {
    // console.log("PageSize", current, pageSize);
    setPage(current - 1);
    setLimit((limit) => (limit = pageSize));
    setLoading(true);
    // setPanigate({...panigate,limit:pageSize})
    // panigate.page = current -1;
    // panigate.limit = pageSize
  };

  const fetchProductAll = async (context) => {
    setLoading(true);
    // console.log("context", context);
    const productSearch = context.queryKey && context.queryKey[2];
    const page = context.queryKey && context.queryKey[3];
    const limit = context.queryKey && context.queryKey[1]; //khi có context.queryKey sẽ lấy context.queryKey[1]: limit
    const res = await productService.getAllProducts(productSearch, limit, page);
    setLoading(false)
    return res;
  };
  const { data: products, isPreviousData, isLoading } = useQuery(
    ["products", limit, searchDebounce, page],
    fetchProductAll,
    { retry: 3, retryDelay: 1000, keepPreviousData: true }
  );
  // keepPreviousData: giúp giữ lại những data cũ mà ko cần load lại lại datta cũ đó
  // console.log("products", products);
  // console.log("isPreviousData", isPreviousData);
  // useEffect(() =>{
  //   if(products?.data?.length >0){
  //     setStateProduct(products?.data)
  //   }
  // }, [products]);
  const fetchAllTypeProduct = async () => {
    const res = await productService.getAllTypeProduct();

    if (res.status === "OK") {
      setTypeProduct(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  return (
    <LoadingComp isLoading={isLoading }>
      <div id="container" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="grid">
        <SliderComponent arrImages={[slider_1, slider_2, slider_3, slider_4]} />

        <WrapperListProduct>
          <WrapperHeadingProduct>DANH MỤC</WrapperHeadingProduct>
          <WrapperProduct>
            {typeProduct.map((product, index) => (
              <TypeProduct name={product} key={index} />
            ))}
          </WrapperProduct>
        </WrapperListProduct>
        <LoadingComp isLoading={loading }>
        <Row
          style={{ marginTop: "20px", gap: "20px", justifyContent: "center" }}
        >
          {products?.data?.map((product) => {
            return (
              <CardProductComp
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                discount={product.discount}
                image={product.image}
                name={product.name}
                priceOld={product.priceOld}
                priceNew={product.priceNew}
                rating={product.rating}
                selled={product.selled}
                type={product.type}
                id={product._id}
                trademark={product.trademark}
                origin={product.origin}
              />
            );
          })}
        </Row>
        </LoadingComp>

        {/* Đây là nút xem thêm, click vào sẽ hiển thị thêm sản phẩm */}

        {/* <ButtonComponent styleButton ={{background : "var(--primary-color)",width:"150px", margin:"15px auto 10px", color:"#fff" }} 
   textButton={isPreviousData ? "Đang Load" : "Xem Thêm"}
   
    onClick={ () => setLimit((pre) => pre +5)}
    disabled={products?.total === products?.data?.length  || products?.totalPages === 1}
    /> */}

        <Pagination
          defaultCurrent={page + 1}
          total={100}
          defaultPageSize={5}
          pageSizeOptions={[5, 10, 15]}
          onChange={onChange}
          style={{ textAlign: "center", padding: "20px 0" }}
        />
      </div>
    </div>
    </LoadingComp>
    
  );
};

export default HomePage;
