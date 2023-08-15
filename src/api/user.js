import request from '@/utils/request';

export function login(data) {
  return request({
    method: "post",
    url: '/user/login',
    headers: {
      'Content-Type': "multipart/form-data; "
    },
    data
  });
}

export function register(data) {
  return request({
    method: "post",
    url: "/user/register",
    headers: {
      'Content-Type': "multipart/form-data; "
    },
    data
  })
}

export function upload_route(data){
  return request({
    method: "post",
    url: "/user/user_search_route_insert",
    headers: {
      'Content-Type': "multipart/form-data; "
    },
    data
  })
}
