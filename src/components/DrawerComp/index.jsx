import React from "react";
import { Drawer } from "antd";
const DrawerComp = ({
  title = "Drawer",
  placement = "left",
  isOpen = false,
  children,
  ...rest
}) => {
  return (
    <>
      <Drawer title={title} placement={placement} open={isOpen} {...rest}>
        {children}
      </Drawer>
    </>
  );
};

export default DrawerComp;
