const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return currentUser ? (
    <h1>You're signed in</h1>
  ) : (
    <h1>You're not signed in</h1>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
