import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  // axios.get("/api/users/currentuser");

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
  let baseurl = "";
  if (typeof window === "undefined") {
    // server side call
    baseurl = "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";
  }
  const { data } = await axios.get(`${baseurl}/api/users/currentuser`, {
    headers: {
      Host: "ticketing.dev", // this is required for the server requests when domain is that baseurl
    },
  });

  return data;
};

export default LandingPage;
