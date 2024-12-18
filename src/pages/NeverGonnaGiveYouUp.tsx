import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


const RickROll: React.FC = () => {
    useEffect(() => {
        // 获取图片元素
        const img = document.getElementById('image') as HTMLImageElement;

        // 监听图片加载完成事件
        const handleImageLoad = () => {
            // 图片加载完成后，延迟 3 秒跳转
            setTimeout(() => {
                window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // 跳转目标地址
            }, 2500); // 3 秒延迟
        };

        // 确保图片已经加载完毕
        if (img.complete) {
            handleImageLoad();
        } else {
            img.onload = handleImageLoad;
        }

        // 清理函数（如果需要）
        return () => {
            img.onload = null;
        };
    }, []);

    return (
        <div className="container">
            <img
                id="image"
                src="https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/streams/2012/May/120523/383994-rickroll.jpg"
                alt="Image"
            />
        </div>
    );
};

export default RickROll;