import React, { useEffect, useState } from 'react'
import ButtonComponent from '../../components/ButtonComp/index'
import FormInput from '../../components/FormInput/index'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import styles from "./styles.module.css";
import {useNavigate,useLocation} from "react-router-dom"
import * as userService from "../../services/UserService"
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from "../../components/MessageComp"
import { jwtDecode } from "jwt-decode";
import {useDispatch} from "react-redux"
import { updateUser } from '../../redux/slides/userSlide';
import LoadingComp from '../../components/LoadingComp';

const SignInPage = () => {

  const[email, setEmail] = useState('') 
  const[password, setPassword] = useState('') 
  const dispatch = useDispatch()
  const location = useLocation()
  // console.log("locationLogin", location)

  const mutation = useMutationHooks(
     (data) => userService.loginUser(data)
  )
  const {data, isLoading} = mutation
  // console.log("mutation", mutation)
 const statusData = data?.status

  useEffect(()=>{
    if(statusData==="ERROR") {
      message.error()
    } else if(statusData==="OK") {
         if(location?.state){        ///nếu khi login mà location có thêm thuoọc tính state thì sẽ chuyển đến trang có state(link), ko thì đến trang home
            message.success()
            navigate(location?.state)
         }else{
            message.success()
            navigate('/')
         }
      
      //lưu access_token vào localStorage
      localStorage.setItem("access_token", JSON.stringify(data?.access_token))
      //thêm
      localStorage.setItem("refresh_token", JSON.stringify(data?.refresh_token))

      if(data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        // console.log("decoded",decoded);
        if(decoded?.id){
          handleGetDetailUser(decoded?.id, data?.access_token)
        }
      }

    }
 }, [statusData])

 const handleGetDetailUser = async(id, access_token) =>{
  //thêm
      const storage = localStorage.getItem("refresh_token")
      const refresh_token = JSON.parse(storage)
      const res = await userService.getDetailUser(id, access_token)
      dispatch(updateUser({...res?.data, access_token, refresh_token}))
 }

  const handleChangeEmail = (value) =>{
    setEmail(value)
  }
  const handleChangePassword = (value) =>{
    setPassword(value)
  }
// hàm xử lý gọi API(mutation) với các tham số truyền đi email, password
  const handleSignIn = () =>{
    mutation.mutate({email, password})
  }
  const navigate = useNavigate()
  const handleNavgSignUp = () =>{
    navigate("/sign-up")
  }
  const [isShowPassword, setIsShowPassword] = useState(false)
  return (
    <div className={styles.wrapper} >
    <div className={styles.wrapperSignIn} >
        <h1 className={styles.titleHeader}>Đăng nhập</h1>
        <div className={styles.wapperInput}>
          <div className={styles.textInput}>Tài khoản:</div>
          <FormInput style={{ marginBottom: '10px' }} placeholder="Nhập tài khoản email"  
             value={email} onChange={handleChangeEmail}/>
        </div>
        <div className={styles.wapperInput}>
          <div className={styles.textInput}>Mật khẩu:</div>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <FormInput 
              placeholder="Nhập mật khẩu"
              type={isShowPassword ? "text" : "password"}
              value={password} 
              onChange={handleChangePassword}
            />
          </div>
        </div>

        {data?.status ==="ERROR" && <span style={{color:"red"}}>{data?.message}</span>}
          <LoadingComp isLoading={isLoading}>
          <ButtonComponent
            disabled={!email.length || !password.length }
            onClick={handleSignIn}
            size={40}
            styleButton={{
              background: 'linear-gradient(135deg, rgb(70, 35, 224) 0%,rgb(45, 253, 249) 100%)',
              height: '48px',
              width: '100%',
              border: 'none',
              borderRadius: '50px',
              margin: '16px 0 16px'
            }}
            textbutton={'Đăng nhập'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
          </LoadingComp>
         
        <p className={styles.textLight}>Quên mật khẩu?</p>
        <p>Chưa có tài khoản? 
          <span className={styles.textLight} onClick={handleNavgSignUp}> Tạo tài khoản</span>
        </p>
      </div>
    </div >
  )
}

export default SignInPage