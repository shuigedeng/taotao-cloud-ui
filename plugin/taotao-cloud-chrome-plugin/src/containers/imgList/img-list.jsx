import React from 'react';
import './img-list.scss';
import { Checkbox } from 'antd';

const ImgList = (props) => {


  // 复选框勾选
    const checkboxChange = (list) => {
        props.getChecked(list)
    }

  let img = props.list.map((e) => {
    return (
      <div key={e} >
        <img src={e} alt="图片" className="img-item" />
        <Checkbox value={e} style={{position:'relative',right:'20px',top:'-10px'}}></Checkbox>
      </div>
    );
  });
  return (
      <Checkbox.Group className="img-list" onChange={checkboxChange}>{img}</Checkbox.Group>
    );
    
  
};

export default ImgList;
