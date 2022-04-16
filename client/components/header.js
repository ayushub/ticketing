import Link from "next/link";

export default ({ currentUser }) => {
  return (
    <div className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Ticketek</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {currentUser ? "Sign Out" : "Sign In/Up"}
        </ul>
      </div>
    </div>
  );
};
