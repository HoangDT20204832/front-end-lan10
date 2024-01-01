import React,{ Fragment, useEffect } from 'react'
import HeaderComponent from '../HeaderComp/index'
import FooterComp from '../FooterComp'
import NavbarAcountComp from '../NavbarAcountComp'
import styles from "./styles.module.css"
import {Row} from "antd"
const DefaultComponent = ({children}) => {
  return (
    <div>
        <HeaderComponent/>
        <div className={styles.wrapAccount}>
          <Row className="grid">
          <NavbarAcountComp/>
          {children}
          </Row>
        </div>
        <FooterComp />
    </div>
  )
}

export default DefaultComponent