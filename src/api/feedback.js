import request from "@/utils/request";

export function get_search_feedback() {
  return request({
    method: "get",
    url: "/feedback/search_feedback",
  });
}

export function get_search_facilities() {
  return request({
    method: "get",
    url: "/feedback/search_facilities",
  });
}

export function add_facilities(id) {
  return request({
    method: "get",
    url: "/feedback/add_facilities",
    params: {
      ID: id,
    },
  });
}

export function delete_facilities(id) {
  return request({
    method: "get",
    url: "/feedback/delete_facilities",
    params: {
      ID: id,
    },
  });
}

export function get_search_user_feedback(username) {
  return request({
    method: "get",
    url: "/feedback/search_user_feedback",
    params: {
      name: username,
    },
  });
}

export function upload_feedback_question(data) {
  return request({
    method: "post",
    url: "/feedback/upload_feedback",
    data,
    headers: {
      "Content-Type": "multipart/form-data; ",
    },
    timeout: 100000
  });
}

export function get_user_routes(username){
  return request({
    method: "get",
    url: "/feedback/search_user_routes",
    params: {
      name: username,
    },
  })
}
