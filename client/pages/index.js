import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  // axios.get("/api/users/currentuser");

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  let baseurl = "";
  if (typeof window === "undefined") {
    // server side call
    baseurl = "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";
  }
  const { data } = await axios.get(`${baseurl}/api/users/currentuser`, {
    // mainly for host (when making api call with the above baseurl since nginx doesn't understand that domain) and cookie
    headers: req.headers,
  });

  return data;
};

export default LandingPage;
