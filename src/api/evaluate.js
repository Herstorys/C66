import request from '@/utils/request';

export function get_address() {
  return request({
    method: 'get',
    url: '/evaluate/address'
  });
}

export function get_evaluation(address) {
  return request({
    method: 'get',
    url: '/evaluate/evaluation',
    params: {
      name: address
    }
  });
}

export function get_poi_data() {
  return request({
    method: 'get',
    url: '/evaluate/poi_analysis'
  });
}
