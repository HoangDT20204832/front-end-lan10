import { Upload } from "antd";
import styled from "styled-components";
export const WrapperUploadFile = styled(Upload)`
    
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;        
    }

    & .ant-upload-list-picture-card .ant-upload-list-item {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-picture-card-container {
        display: inline-block;
        width: 60px;
        height: 60px;
        margin: 0 8px 8px 0;
        vertical-align: top;
    }


`