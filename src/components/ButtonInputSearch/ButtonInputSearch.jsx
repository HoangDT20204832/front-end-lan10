import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComp/index";
const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textbutton,
    bordered,
    backgroundColorInput = "#fff",
    backgroundcolorbutton = "rgb(14,92,182) ",
    colorButton = "#fff",
    onClick 
  } = props;
  return (
    <div style={{ display: "flex" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{ backgroundColor: backgroundColorInput }}
        {...props}
      />
      <ButtonComponent
        size={size}
        styleButton={{
          background: backgroundcolorbutton ,
          border: !bordered && "none",
        }}
        textbutton={textbutton}
        icon={<SearchOutlined style={{ color: "#fff" }} />}
        styleTextButton={{color: colorButton}}
        onClick = {onClick}
      />
      
    </div>
  );
};

export default ButtonInputSearch;
