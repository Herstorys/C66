import request from "@/utils/request";

export function get_address() {
  return request({
    method: "get",
    url: '/comparable/address',
  });
}

export function get_evaluation(address){
  return request({
    method: "get",
    url: '/comparable/evaluation',
    params: {
      name : address
    }
  })
}
