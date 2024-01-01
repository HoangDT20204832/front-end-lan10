import React,{ Fragment, useEffect } from 'react'
import HeaderComponent from '../HeaderComp/index'
import FooterComp from '../FooterComp'


const DefaultComponent = ({children}) => {
  return (
    <div>
        <div style={{position:"fixed", top:"0",width:"100%", zIndex:"101"}}>
          <HeaderComponent />
        </div>
        <div style={{marginTop:"120px"}}>
        {children}
        </div>
        <FooterComp />
    </div>
  )
}

export default DefaultComponent