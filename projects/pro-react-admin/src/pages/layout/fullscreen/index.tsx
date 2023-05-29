import React, { useEffect, useState } from 'react'
import screenfull from 'screenfull'
import { message, Space } from 'antd'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'

const FullScreen = () => {
  const [fullScreen, setFullScreen] = useState<boolean>(screenfull.isFullscreen)

  useEffect(() => {
    screenfull.on('change', () => {
      if (screenfull.isFullscreen) setFullScreen(true)
      else setFullScreen(false)
      return () => screenfull.off('change', () => {})
    })
  }, [])

  const handleFullScreen = () => {
    if (!screenfull.isEnabled) message.warning('当前您的浏览器不支持全屏')
    screenfull.toggle()
  }
  return (
    <Space onClick={handleFullScreen}>
      {fullScreen ? (
        <FullscreenExitOutlined style={{ fontSize: 16 }} />
      ) : (
        <FullscreenOutlined style={{ fontSize: 16 }} />
      )}
    </Space>
  )
}
export default FullScreen
