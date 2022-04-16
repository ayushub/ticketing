import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps }) => {
  console.log("props", pageProps);
  return (
    <div>
      <h1>Header</h1>
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const { data } = await buildClient(appContext.ctx).get(
    "/api/users/currentuser"
  );
  let pageProps = {};
  if (appContext.Component.getInitialProps)
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  console.log("from ", pageProps);
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
