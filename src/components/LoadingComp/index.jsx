import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const LoadingComp = ({children, isLoading, delay=200}) => {
  return (
    <Spin
    indicator={
      <LoadingOutlined
        style={{
          fontSize: 24,
        }}
        spin
      />
    }
    spinning={isLoading} delay={delay}
  > {children}
  </Spin>
  )
}

export default LoadingComp