import { Input } from "antd";
import styled from "styled-components";

export const WrapperInputStyle = styled(Input)`
    height: 35px;
    outline: none;
    border-radius: 5px;
    &:focus {
        background-color: rgb(232, 240, 254);
    }
`