import React, { useEffect, useState } from 'react'
import FormInput from '../../components/FormInput/index'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import styles from "./styles.module.css";
import ButtonComponent from '../../components/ButtonComp/index';
import {useNavigate} from "react-router-dom"
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as userService from "../../services/UserService"
import * as message from "../../components/MessageComp"
import LoadingComp from '../../components/LoadingComp';

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowComfirmPassword, setIsShowComfirmPassword] = useState(false)
  const[email, setEmail] = useState('') 
  const[password, setPassword] = useState('') 
  const[confirmPassword, setConfirmPassword] = useState('') 

  const mutation = useMutationHooks(
    (data) => userService.signUpUser(data)   
 )

 const {data, isSuccess,isError, isLoading} = mutation
 const statusData = data?.status
 useEffect(()=>{

    if(statusData==="ERROR") {
      message.error()
    } else if(statusData==="OK") {
      message.success()
      handleNavgSignIn()
    }
 }, [statusData])

  const handleChangeEmail = (value) =>{
    setEmail(value)
  }
  const handleChangePassword = (value) =>{
    setPassword(value)
  }
  const handleChangeConfirmPassword = (value) =>{
    setConfirmPassword(value)
  }

  const handleSignUp = () =>{
    mutation.mutate({email, password, confirmPassword})
  }

  const navigate = useNavigate()
  const handleNavgSignIn = () =>{
    navigate("/sign-in")
  }
  return (
    <div className={styles.wrapper} >
    <div className={styles.wrapperSignUp} >
        <h1 className={styles.titleHeader}>Đăng ký</h1>
        <div className={styles.wapperInput}>
          <div className={styles.textInput}>Tài khoản:</div>
          <FormInput style={{ marginBottom: '10px' }} placeholder="Nhập tài khoản email" 
            value= {email} onChange={handleChangeEmail}/>
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
              value= {password} onChange={handleChangePassword}
            />
          </div>
        </div>
        <div className={styles.wapperInput}>
          <div className={styles.textInput}>Xác thực mật khẩu:</div>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowComfirmPassword(!isShowComfirmPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
              isShowComfirmPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <FormInput 
              placeholder="Nhập mật khẩu"
              type={isShowComfirmPassword ? "text" : "password"}
              value= {confirmPassword} onChange={handleChangeConfirmPassword}
            />
          </div>
        </div>

        {data?.status ==="ERROR" && <span style={{color:"red"}}>{data?.message}</span>}

        <LoadingComp isLoading={isLoading}>
        <ButtonComponent
          //disabled : khi ko thõa mãn các điều kiện trong disabled thì nút có disabled sẽ ko ấn được(bị vô hiệu hóa) 
            disabled={!email.length || !password.length || !confirmPassword.length}
            onClick={handleSignUp}
            size={40}
            styleButton={{
              background: 'linear-gradient(135deg, rgb(70, 35, 224) 0%,rgb(45, 253, 249) 100%)',
              height: '48px',
              width: '100%',
              border: 'none',
              borderRadius: '50px',
              margin: '16px 0 16px'
            }}
            textbutton={'Đăng ký'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
        </LoadingComp>
          
        <p>Bạn đã có tài khoản? 
          <span className={styles.textLight} onClick={handleNavgSignIn}> Đăng nhập </span>
        </p>
      </div>
    </div >
  )
}

export default SignUpPage