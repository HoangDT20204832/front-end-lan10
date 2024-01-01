import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as userService from "../../services/UserService";
import { useSelector } from "react-redux";
import * as messagee from "../../components/MessageComp/index";
import FormInput from "../../components/FormInput";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

const PasswordUserPage = () => {
  const user = useSelector((state) => state.user);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowPassword2, setIsShowPassword2] = useState(false);
  const [isShowPassword3, setIsShowPassword3] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangeOldPass = (value) => {
    setOldPassword(value);
  };
  const handleChangeNewPass = (value) => {
    setNewPassword(value);
  };
  const handleChangeConfirmPass = (value) => {
    setConfirmPassword(value);
  };
  const mutation = useMutationHooks((data) => {
    const { id, ...rest } = data;
    const res = userService.updateUserPassword(id, rest);
    return res;
  });
  const { data: dataPass } = mutation;

  const handleSave = () => {
    mutation.mutate({
      id: user?.id,
      oldPassword,
      newPassword,
      confirmPassword,
    });
  };

  useEffect(() => {
    if (dataPass?.status === "OK") {
      messagee.success("Thay đổi mật khẩu thành công");
    } else if (dataPass?.status === "ERROR") {
      messagee.error("Thay đổi mật khẩu thất bại");
    }
  }, [dataPass?.status]);

  return (
    <Col span={20} className={styles.container}>
      <div className={styles.containerHeader}>Đổi mật khẩu</div>
      <Row>
        <Col span={14} className={styles.containerContent}>
          <div className={styles.containerContentLeft}>
            <div className={styles.wapperInput}>
              <div className={styles.textInput}>Mật khẩu cũ:</div>
              <div style={{ position: "relative" }}>
                <span
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  style={{
                    zIndex: 10,
                    position: "absolute",
                    top: "4px",
                    right: "8px",
                  }}
                >
                  {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                </span>
                <FormInput
                  placeholder="Nhập mật khẩu"
                  type={isShowPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={handleChangeOldPass}
                />
              </div>
            </div>
            <div className={styles.wapperInput}>
              <div className={styles.textInput}>Mật khẩu mới:</div>
              <div style={{ position: "relative" }}>
                <span
                  onClick={() => setIsShowPassword2(!isShowPassword2)}
                  style={{
                    zIndex: 10,
                    position: "absolute",
                    top: "4px",
                    right: "8px",
                  }}
                >
                  {isShowPassword2 ? <EyeFilled /> : <EyeInvisibleFilled />}
                </span>
                <FormInput
                  placeholder="Nhập mật khẩu"
                  type={isShowPassword2 ? "text" : "password"}
                  value={newPassword}
                  onChange={handleChangeNewPass}
                />
              </div>
            </div>
            <div className={styles.wapperInput}>
              <div className={styles.textInput}>Xác nhận lại mật khẩu:</div>
              <div style={{ position: "relative" }}>
                <span
                  onClick={() => setIsShowPassword3(!isShowPassword3)}
                  style={{
                    zIndex: 10,
                    position: "absolute",
                    top: "4px",
                    right: "8px",
                  }}
                >
                  {isShowPassword3 ? <EyeFilled /> : <EyeInvisibleFilled />}
                </span>
                <FormInput
                  placeholder="Nhập mật khẩu"
                  type={isShowPassword3 ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleChangeConfirmPass}
                />
              </div>
            </div>

            <button
              className={styles.containerContentLeftButton}
              onClick={handleSave}
            >
              Đổi mật khẩu
            </button>
          </div>
        </Col>

        <Col span={10}>
          <img
            className={styles.containerContentImg}
            src= "https://giaohangtietkiem.vn/wp-content/uploads/2019/06/mat-khau-mac-dinh-tren-dau-ghi-hikvision.jpg" 
          />
        </Col>
      </Row>
    </Col>
  );
};

export default PasswordUserPage;
