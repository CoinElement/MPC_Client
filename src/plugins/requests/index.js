import Vue from "vue";
import axios from "axios";
//import { Notification } from "element-ui";

const request = axios.create({
  baseURL: "https://6wjw3w2zy7.execute-api.us-east-1.amazonaws.com/init"
});

request.interceptors.request.use(config => {
  return config;
});

request.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.status == 401) {
      Notification.error({
        type: "error",
        message: "You are not logged in"
      });
    } else {
      console.log(JSON.stringify(error));
      Notification.error({
        type: "error",
        message: "Get response data failed"
      });
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$axios = request;
