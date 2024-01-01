import styled from "styled-components";
import { Row, Col } from "antd";

export const WrapperProductType = styled(Row)`
  padding-bottom: 20px;
  background-color: var(--background-color);
  flex-wrap: nowrap;
  padding-top: 20px;
`;

export const WrapperNavbar = styled(Col)`
  background-color: #fff;
  margin-right: 10px;
  padding: 10px;
  border-radius: 6px;
`;
export const WrapperProducts = styled.div`
  background-color: #fff;
  padding: 0 10px;
  border-radius: 6px;
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap:wrap;
`;

export const NavbarHeader= styled.div`
  font-weight: 600;
  font-size: 1.8rem;
  padding: 10px 0 10px 0;

`

export const NavbarItem= styled.div`
  font-size:1.5rem;
  padding: 10px 0 10px 0;
  border-bottom: 1px solid #666;
`

export const NavbarItemLable= styled.div`
  margin-bottom:10px
`
export const NavbarItemPrice= styled.input`
  width:46%;
  outline:none;
  border:1px solid #666;
  -moz-appearance: textfield;
  appearance: textfield;
`
export const NavbarItemOrigin= styled.div`
  
`
export const NavbarOriginRadio= styled.input`
  color: var(--active-color);
  margin-right:5px;
  cursor: pointer
`
export const NavbarItemPriceBtn = styled.div`
  margin: 15px auto 10px;
  padding:5px;
  background-color:var(--active-color);
  color:var(--white-color);
  text-align:center;
  border-radius: 5px;
  cursor:pointer;
`

export const NavbarItemSelect= styled.select`
  outline:none;
  cursor:pointer;

`