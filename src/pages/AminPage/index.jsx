import React, { useState } from "react";
import { Menu } from "antd";
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import UserInForAd from "../../components/UserInforAdComp";
import ProductInForAd from "../../components/ProductInforAdComp";
import OrderInForAd from "../../components/OrderInForAd";
const AdminPage = () => {
    function getItem(label, key, icon, children, type) {
        return {
          key,
          icon,
          children,
          label,
          type,
        };
      }
    const items = [
        getItem('Người dùng', 'user', <MailOutlined />),
        getItem('Sản phẩm', 'product', <AppstoreOutlined />),
        getItem('Đơn hàng', 'order', <AppstoreOutlined />),
    
      ];
  // const rootSubmenuKeys = ["user", "product"];
//   const [openKeys, setOpenKeys] = useState(["user"]);
  const [keySelected, setKeySelected] = useState('')
//   const onOpenChange = (keys) => {
//     const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
//     if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
//       setOpenKeys(keys);
//     } else {
//       setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
//     }
//   };
const renderPage = (key) =>{
    switch(key){
        case 'user':
            return (<UserInForAd />)
        case 'product':
            return (<ProductInForAd />)
        case 'order':
          return (<OrderInForAd />)
        default: 
            return <></>
    }
}   
const handleOnClickMenu = ({key}) =>{
    // console.log('onClickMenu',{item, key, keyPath, domEvent})
    setKeySelected(key)
   }
  // console.log('keySelected',keySelected)
  return (
    <div style={{display:"flex"}}>
      <Menu
        mode="inline"
        // openKeys={openKeys}
        // onOpenChange={onOpenChange}
        style={{
          width: 256,
          height: "100vh",
          boxShadow:"1px 1px 2px #ccc",

        }}
        items={items}
        onClick={handleOnClickMenu}
      />

      <div style={{padding:"13px 20px", flex:"1"}}>
         {renderPage(keySelected)}
      </div>
    </div>
  );
};

export default AdminPage;
