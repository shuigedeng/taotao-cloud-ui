import React, { useState } from 'react';
import './Popup.css';
import { Button,Divider } from 'antd';
import { getAllImage } from './handle';
import checkPage from './checkPage';
import ImgListShow from '../../containers/imgList/img-list';

const Popup = () => {
  // 保存图片链接
  const [imgList, setImgList] = useState([]);
  // 保存已经勾选了的图片
  const [checkedImg,setCheckImg] = useState([])
  // 注入脚本
  const insertScripts = () => {
    checkPage(async (tab) => {
      //依赖注入
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getAllImage,
      });
      //console.log(result);
      // 这个API暂时用不到，可以删掉，如果想在新打开的tab页中展示图片，这是有用的
      chrome.storage.local.set({
        'imgs':result[0]?.result || []
      })
      setImgList(result[0]?.result || []);
    });
  };

  //获取当期勾选了的图片
  const getCheckedImg = (list) => {
      setCheckImg(list)
  }

  //下载图片
  const downLoadImg = () => {
    
  }

  return (
    <div className="App">
      <div className="button-tool">
        <Button type="primary" onClick={insertScripts}>
          获取图片
        </Button>
        <Button type="primary" disabled={checkedImg.length===0} onClick={downLoadImg}>
          下载图片
        </Button>
      </div>
      <Divider orientation="left" style={{fontSize:'10px',fontWeight:500,letterSpacing:'5px'}}>
        共{imgList.length}张图片，已勾选{ checkedImg.length}张图片
      </Divider>

      <ImgListShow list={imgList} getChecked={getCheckedImg} />
    </div>
  );
};

export default Popup;
