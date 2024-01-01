import React from "react";
import {  Col,Popover } from "antd";
import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAcount,
  WrapperHeaderNavbar,
  WrapperHeaderNavbarList,
  WrapperHeaderNavbarItem,
  WrapperBadge
} from "./styles.js";
import {
  UserOutlined,
  ShoppingCartOutlined,
  FacebookOutlined,
  InstagramOutlined,
  BellOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useMemo } from "react";
import * as userService from "../../services/UserService.js"
import { resetUser } from "../../redux/slides/userSlide";
import { useEffect } from "react";
import { searchProduct } from "../../redux/slides/productSlide.js";
import BadgeComp from "../BadgeComp/index.jsx";




function HeaderComponent() {
  const navigate = useNavigate();
  const [isOpenPopover, setIsOpenPopover] = useState(false)
  const [isHovered, setHovered] = useState(false);
  const user = useSelector((state) => state.user);
  // console.log("user",user);
  const dispatch = useDispatch();
  const [namee, setNamee] = useState('')
  const [avatarr, setAvatarr] = useState('')
 const order = useSelector((state) => state.order)
  const handleNavgLogin = () => {
    navigate("/sign-in");
  };
  const handleNavgSignUp = () => {
    navigate("/sign-up");
  };

  const handleLogoutUser = async() =>{
    await userService.logoutUser();
    dispatch(resetUser())
  }
  
  useEffect(() =>{
      setNamee(user?.name)
      setAvatarr(user?.avatar)
  }, [user?.name, user?.avatar])

  const content = (
    <div >
      <p style={{cursor: "pointer"}} onClick={() => handleClickNav("account") } >Tài khoản của tôi</p>
      <p style={{cursor: "pointer"}} onClick={() => handleClickNav("my-order") } >Đơn mua</p>
      {user?.isAdmin &&(
        <p style={{cursor: "pointer"}} onClick={() => handleClickNav("system/admin") } >Quản lý hệ thống</p>
      )}
      <p style={{cursor: "pointer"}} onClick={() => handleClickNav()}>Đăng xuất</p>
    </div>
  );
 const handleClickNav = (type) =>{
    switch(type)  {
      case "account":
        navigate("/account")
        break;
      case "my-order":
        navigate("/my-order", {state: {
          id: user?.id,
          // token : user?.access_token
        }
      })
        break;
      case "system/admin":
        navigate("/system/admin")
        break;
      default:
        handleLogoutUser()
    }
    setIsOpenPopover(false)
 }

  const [arrow, setArrow] = useState('Show');
  const mergedArrow = useMemo(() => {
    if (arrow === 'Hide') {
      return false;
    }
    if (arrow === 'Show') {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  //searchInput
  const [search, setSearch] = useState("")

  const onSearch = (e) =>{
    // console.log("input", e.target.value)
    setSearch(e.target.value)
    // dispatch(searchProduct(e.target.value))
  }
const onClickSearch = () =>{
  dispatch(searchProduct(search))
}

  return (
    <div style={{ backgroundColor: "var(--primary-color)"}}>
      <WrapperHeaderNavbar className="grid">
        <WrapperHeaderNavbarList>
          <WrapperHeaderNavbarItem>
            Chào mừng đến với cửa hàng{" "}
          </WrapperHeaderNavbarItem>
          <WrapperHeaderNavbarItem>
            <span>Kết nối</span>
            <div
              style={{ display: "block", margin: "0 5px" }}
            >
              <FacebookOutlined style={{ color: "#fff", fontSize: "16px" }} />
            </div>

            <div
              style={{ display: "block" }}
            >
              <InstagramOutlined style={{ color: "#fff", fontSize: "16px" }} />
            </div>
          </WrapperHeaderNavbarItem>
        </WrapperHeaderNavbarList>

        <WrapperHeaderNavbarList>
          <WrapperHeaderNavbarItem>
            <BellOutlined style={{ padding: "0 5px" }} />
            <span>Thông báo</span>
          </WrapperHeaderNavbarItem>

          <WrapperHeaderNavbarItem>
            <QuestionCircleOutlined style={{ padding: "0 5px" }} />
            <span>Trợ giúp</span>
          </WrapperHeaderNavbarItem>

          <WrapperHeaderNavbarItem>
          <WrapperHeaderAcount>
            {avatarr ? (<img src={avatarr} alt="ảnh đại diện"style={{
                        height: '30px',
                        width: '30px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}  />)
            : (<UserOutlined style={{ fontSize: "30px" }} />)}
            
            {user?.name ? ( //kiểm tra xem nếu có user.name(người dùng đã đăng nhập ) thì hiển thị th1; ko thì th2
              <div>
                  <Popover 
                    placement="bottom"
                    trigger="click"
                    content={content}
                    arrow={mergedArrow}
                    open={isOpenPopover}
                    onClick= {() => setIsOpenPopover((pre) => !pre)}
                  > 
                <div style={{ cursor: "pointer" , fontSize:"14px"} }>{namee || "User"}</div>
                  </Popover>
                </div>
              
            ) : (
              <div style={{ cursor: "pointer" , fontSize:"14px"}}>
                <span onClick={handleNavgLogin}>Đăng nhập</span>
                <span onClick={handleNavgSignUp}>/Đăng ký</span>
              </div>
            )}
          </WrapperHeaderAcount>
        </WrapperHeaderNavbarItem>
        </WrapperHeaderNavbarList>

        

        
      </WrapperHeaderNavbar>

      <WrapperHeader gutter={16} className="grid">
        <Col span={4}>
          <WrapperTextHeader onClick={() => navigate("/")}>SHOP BAN HANG</WrapperTextHeader>
        </Col>
        <Col span={17}>
          <ButtonInputSearch
            placeholder="input search text"
            textbutton="Search"
            size="large"
            bordered={false}
            backgroundcolorbutton = "rgb(13,92,182)"
            onChange={onSearch}
            onClick= {onClickSearch}
          />
        </Col>
        <Col
          span={3}
          style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "center"}}
        >
          
          <div  style={{cursor:"pointer"}}>
            <WrapperBadge count={order?.orderItems?.length} size="small"
               onMouseEnter={() => setHovered(true)}
               onMouseLeave={() => setHovered(false)}> {/* // count ={order?.orderItems?.length} */}
              <ShoppingCartOutlined
                style={{ fontSize: "30px", color: "#fff" }}
              />
                {isHovered && <BadgeComp />}
            
            </WrapperBadge>
          
          </div>
        </Col>
      </WrapperHeader>
    </div>
  );
}

export default HeaderComponent;
