import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routers } from "./routes";
import DefaultComponent from "./components/DefaultComp/index";
import DefaultNavComponent from "./components/DefaultNavComp/index"
import GlobalStyles from "./components/GlobalStylesComp";
import {
  useQuery,
} from '@tanstack/react-query'
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as userService from "./services/UserService";
import {useDispatch, useSelector} from "react-redux"
import {resetUser,  updateUser } from "./redux/slides/userSlide";


function App() {

  const dispatch = useDispatch()
  const user = useSelector((state)=> state.user)
  
  useEffect(() =>{
    const{ storgateData, decoded} = handleDecoded()
      if(decoded?.id){ //nếu tồn tại id của user thì gọi handleGetDetailUser để gọi api getDetailUser lấy thông tin người dùng lên  
        handleGetDetailUser(decoded?.id, storgateData)
      }
    // console.log("storgateData",storgateData)
    }
  ,[])
//hàm đọc và giải mã dữ liệu từ localStorage(cụ thể là dữ liệu access_token) 
//trả về thông tin user(decoded) và access_token(storgateData)
  const handleDecoded = () =>{
    let storgateData = localStorage.getItem("access_token")
    let decoded = {}
    if(storgateData && isJsonString(storgateData)){ //nếu storgateData tồn tại và là kiểu  Stirng
      storgateData= JSON.parse(storgateData);
      //jwtDecodeđể giải mã đối tượng từ access_token(storgateData) => trả về thông tin user ứng vowis access_token đó. 
      decoded = jwtDecode(storgateData);
      // console.log("decoded",decoded);
    }
    return {decoded, storgateData};
  }
  //hàm này được sử dụng để thực hiện một số hành động trước khi một yêu cầu HTTP được gửi đi.
  //kiểm tra xem nếu access_token hết hạn thì sẽ gọi đến refreshToken để cấp lại access_token mới rồi cập nhật vào config.headers['token']. mà ko cần đăng nhập lại
  userService.axiosJWT.interceptors.request.use(async function (config) {
  //   const currentTime = new Date()
  //   const { decoded} = handleDecoded()
  //   //nếu "decoded.exp" là thời điểm hết hạn của acccess_token < thời gian hiện tại thì sẽ gọi  userService.refreshToken() 
  //   // để lấy thông tin mới từ máy chủ và cập nhật access_token mới vào config.headers['token']
  //   if(decoded?.exp < currentTime.getTime() / 1000){
  //     const data = await userService.refreshToken()
  //     config.headers['token'] = `Bearer ${data?.access_token}`
  //   }
  //   return config;
  // }, function (error) {
  //   // Do something with request error
  //   return Promise.reject(error);
  const currentTime = new Date()
  const { decoded } = handleDecoded()
  let storageRefreshToken = localStorage.getItem('refresh_token')
  const refreshToken = JSON.parse(storageRefreshToken)
  const decodedRefreshToken =  jwtDecode(refreshToken)
  if (decoded?.exp < currentTime.getTime() / 1000) {
    if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
      const data = await userService.refreshToken(refreshToken)
      config.headers['token'] = `Bearer ${data?.access_token}`
    }else {
      dispatch(resetUser())
    }
  }
  return config;
}, (err) => {
  return Promise.reject(err)
  });

  const handleGetDetailUser = async(id, access_token) =>{
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await userService.getDetailUser(id, access_token)
    // console.log("res", res) // gồm data, status, message
    dispatch(updateUser({...res?.data, access_token, refreshToken: refreshToken}))
}

  return (
    <GlobalStyles>
      <div>
        <Router>
          <Routes>
            {routers.map((route) => {
              //những trang nào có isShowNavbar = true thì sẽ có DefaultNavComponent(có NavbarComponent, có Header, footer) 
              //không thì sẽ là DefaultComponent(chỉ có Header, footer) nếu route.isShowHeader=true hoặc sẽ ko có gì cả(Fragment) route.isShowHeader=false
              const Layout = route.isShowNavbar ?  DefaultNavComponent : (route.isShowHeader ? DefaultComponent : Fragment);
              const isCheckAuth = !route.isPrivate || user.isAdmin
              return (
                <Route
                  key={route.path}
                  //path: chỉ đường dẫn hướng tới trang của element={<Page/>}
                  path={isCheckAuth && route.path}
                  // element để chỉ trang hiển thị
                  element={
                    <Layout>
                      <route.page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </div>
    </GlobalStyles>
  );
}

export default App;
