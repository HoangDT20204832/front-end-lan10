import { Button } from "antd";
import React from "react";

const ButtonComponent = ({
  size,
  styleButton,
  styleTextButton,
  textbutton, 
  disabled,
  ...rest
}) => {
  return (
    <Button
      size={size}
      style={{...styleButton,background: disabled ? "#ccc" : styleButton.background,
              cursor:disabled ? "not-allowed" : "pointer" }}
      {...rest}
    >
      <span style={styleTextButton}>{textbutton}</span>
    </Button>
  );
};

export default ButtonComponent;
