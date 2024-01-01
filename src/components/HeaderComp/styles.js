import {Row, Badge} from 'antd'
import style from 'styled-components'

export const WrapperHeaderNavbar = style.div`
    padding: 10px 0 10px;
    background-color:var(--primary-color);
    align-items: center;
    display: flex;
    justify-content: space-between;
    color: #fff;
    
`

export const WrapperHeaderNavbarList = style.div`
    display: flex;
`

export const WrapperHeaderNavbarItem = style.div`
    display: flex;
    align-items: center;
    padding: 0 10px;

`

export const WrapperHeader = style(Row)`
    padding: 10px 0px 20px;
    background-color:var(--primary-color);
    align-items: center;
    margin: 0 auto !important;
`

export const WrapperTextHeader = style.span`
    font-size:18px;
    color: #fff;
    font-weight:bold;
    text-align:left;
    cursor:pointer;
`

export const WrapperHeaderAcount = style.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap:10px;
    font-size:12px;
`

export const WrapperTextHeaderSmall = style.span`
    font-size:12px;
    color: #fff;
`
export const WrapperBadge = style(Badge)`
    
`