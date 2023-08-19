import axios from 'axios';
import webConfig from '@/webConfig';
import router from '@/router';
import { getToken } from '@/utils/setToken';

const request = axios.create({
  baseURL: webConfig.baseURL,
  timeout: 10000
});

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(
  (config) => {
    //token，密钥得设置
    let whiteList = webConfig.whiteListApi;
    let url = config.url;
    let token = getToken('token');
    if (whiteList.indexOf(url) === -1 && token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
  //对响应结果做处理
  (res) => {
    //响应得统一处理
    const status = res.data.code || 200;
    const message = res.data.msg || '未知错误';
    if (status === 401) {
      alert('你没有权限');
      return Promise.reject(new Error(message));
    }
    if (status !== 200) {
      alert('错误码' + status + '   ' + message);
      return Promise.reject(new Error(message));
    }
    return res;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

export default request;
