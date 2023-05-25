/*global chrome*/

import React, { useState } from 'react';
import { Button } from 'antd';
import './App.css';

const App = () => {
    const [count, setCount] = useState(0)
    const changeCount = () => {
        setCount(count + 1)
    }
    return (
        <div className='app'>
            <p>数值：{count}</p>
            <Button type='primary' onClick={changeCount}>点击</Button>
        </div>
    )
}

export default App;
