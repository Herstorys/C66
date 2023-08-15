import request from '@/utils/request';

export function get_facility(classification) {
  return request({
    method: "get",
    url: '/facility/facility',
    params:{
      classification
    }
  });
}

export function get_facilities(){
  return request({
    method: "get",
    url: '/facility/facilities',
  });
}
