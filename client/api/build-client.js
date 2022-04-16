import axios from "axios";

export default ({ req }) => {
  let baseURL = "";
  if (typeof window === "undefined") {
    // server side call
    baseURL = "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";
  }

  return axios.create({
    baseURL,
    // mainly for host (when making api call with the above baseurl since nginx doesn't understand that domain) and cookie
    headers: req.headers,
  });
};
