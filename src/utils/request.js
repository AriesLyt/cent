/*
 * @Author: 薛莹
 * @LastEditors: 秦琛
 * @description: page description
 * @Date: 2021-09-09 13:34:15
 * @LastEditTime: 2022-03-31 15:46:36
 */
import axios from "axios";
axios.defaults.withCredentials = true;
// 基础地址
let baseURL = '';

// if (process.env.NODE_ENV === 'production') {
//   baseURL = process.env.common['API'] + baseURL;
// }

const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(config => {
  return config;
}, error => {
  console.log(error);
  return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(response => {
  return response.data;
}, error => {
  console.log(error)
})


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params = {}) {
  try {
    return service({
      url,
      params,
      method: 'GET',
    })
  } catch (error) {
    console.error('get:', error);
  }
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  try {
    return service({
      url,
      data,
      method: 'POST',
    });
  } catch (error) {
    console.error('post:', error);
  }
}
