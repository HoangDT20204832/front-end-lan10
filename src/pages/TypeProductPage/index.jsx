import React, { useEffect, useState } from "react";
import CardProductComp from "../../components/CardProductComp";
import { Col, Pagination } from "antd";
import {
  WrapperProductType,
  WrapperNavbar,
  WrapperProducts,
  NavbarHeader,
  NavbarItem,
  NavbarItemLable,
  NavbarItemPrice,
  NavbarItemOrigin,
  NavbarOriginRadio,
  NavbarItemPriceBtn,
  NavbarItemSelect,
} from "./styles";
import { useLocation } from "react-router-dom";
import * as productService from "../../services/ProductService";
import { useSelector } from "react-redux";
import LoadingComp from "../../components/LoadingComp";

const TypeProductPage = (type) => {
  const location = useLocation();
  // console.log("location: ", location);
  const { state } = location;
  const productSearch = useSelector((state) => state.product.search);
  const [loading, setLoading] = useState(false);

  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 5,
    totalItems: 5,
  });


  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
    setLoading(true);
 
  };
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [price, setPrice] = useState("");
  // const [name, setName] = useState('');
  const [origin, setOrigin] = useState("");
  const [rating, setRating] = useState(0);

  // let productsType=[];
  const [productsType, setProductsType] = useState(null);

  const handleClickPrice = () => {
    setPrice(`${minPrice}-${maxPrice}`);
  };
  const fetchData = async () => {
    setLoading(true);
    const queryParams = [];

    if (price) queryParams.push(`priceNew=${price}`);
    if (productSearch) queryParams.push(`name=${productSearch}`);
    if (origin) queryParams.push(`origin=${origin}`);
    if (rating) queryParams.push(`rating=${rating}`);
    if (state) queryParams.push(`type=${state}`);
    if (panigate.page) queryParams.push(`page=${panigate.page}`);
    if (panigate.limit) queryParams.push(`limit=${panigate.limit}`);

    const queryString = queryParams.join("&");

    const response = await productService.getProductsByType(queryString);
    const dataPro = response.data;
    if (response?.status === "OK") {
      setLoading(false);
      setProductsType(dataPro);
      setPanigate({ ...panigate, totalItems: response.total });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [price, productSearch, origin, rating, panigate.page, panigate.limit]);
  // const {data: productsType} = useQuery(['product-type',price, name, origin, rating,panigate.page,panigate.limit ], fetchData)
  // console.log("productsType", productsType);

  return (
    <div style={{ backgroundColor: "var(--background-color)" }}>
      <WrapperProductType className="grid">
        <WrapperNavbar span={4}>
          {/* <NavbarComp /> */}
          <NavbarHeader>BỘ LỌC TÌM KIẾM</NavbarHeader>

          <NavbarItem>
            <NavbarItemLable>Nơi bán</NavbarItemLable>
            <NavbarItemOrigin>
              <div>
                <NavbarOriginRadio
                  type="radio"
                  value=""
                  checked={origin === ""}
                  onChange={(e) => setOrigin(e.target.value)}
                />
                All
              </div>
              <div>
                <NavbarOriginRadio
                  type="radio"
                  value="Hà Nội"
                  checked={origin === "Hà Nội"}
                  onChange={(e) => setOrigin(e.target.value)}
                />
                Hà Nội
              </div>

              <div>
                <NavbarOriginRadio
                  type="radio"
                  value="Hồ Chí Minh"
                  checked={origin === "Hồ Chí Minh"}
                  onChange={(e) => setOrigin(e.target.value)}
                />
                Hồ Chí Minh
              </div>

              <div>
                <NavbarOriginRadio
                  type="radio"
                  value="Nước ngoài"
                  checked={origin === "Nước ngoài"}
                  onChange={(e) => setOrigin(e.target.value)}
                />
                Nước ngoài
              </div>
            </NavbarItemOrigin>
          </NavbarItem>

          <NavbarItem>
            <NavbarItemLable>Khoảng giá</NavbarItemLable>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.3rem",
              }}
            >
              <NavbarItemPrice
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ appearance: "textfield" }}
              />
              -
              <NavbarItemPrice
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <NavbarItemPriceBtn onClick={handleClickPrice}>
              ÁP DỤNG
            </NavbarItemPriceBtn>
            {/* <label>Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> */}
          </NavbarItem>

          <NavbarItem>
            <NavbarItemLable>Đánh giá</NavbarItemLable>
            <NavbarItemSelect
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Chọn đánh giá</option>
              <option value="1">1 sao trở lên</option>
              <option value="2">2 sao trở lên</option>
              <option value="3">3 sao trở lên</option>
              <option value="4">4 sao trở lên</option>
              <option value="5">5 sao </option>
            </NavbarItemSelect>
          </NavbarItem>
        </WrapperNavbar>
        <Col span={20} style={{ backgroundColor: "#fff" }}>
          <LoadingComp isLoading={loading}>
            <WrapperProducts>
              {productsType?.map((productType, index) => {
                  return (
                    <CardProductComp
                      key={productType._id}
                      countInStock={productType.countInStock}
                      description={productType.description}
                      discount={productType.discount}
                      image={productType.image}
                      name={productType.name}
                      priceOld={productType.priceOld}
                      priceNew={productType.priceNew}
                      rating={productType.rating}
                      selled={productType.selled}
                      type={productType.type}
                      id={productType._id}
                      trademark={productType.trademark}
                      origin={productType.origin}
                    />
                  );
                })}
            </WrapperProducts>
          </LoadingComp>

          <Pagination
            defaultCurrent={panigate.page + 1}
            total={panigate.totalItems}
            // total={100}
            // pageSize={5}
            defaultPageSize={5}
            pageSizeOptions={[5, 10, 15]}
            onChange={onChange}
            style={{ textAlign: "center", padding: "20px 0" }}
          />
        </Col>
      </WrapperProductType>
    </div>
  );
};

export default TypeProductPage;
