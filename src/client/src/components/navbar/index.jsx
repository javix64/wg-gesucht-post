import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-lime-200 bg-opacity-20 shadow-xl sm:items-baseline w-full rounded-b-3xl">
        <div>
          <Link
            to={"/"}
            className="active:bg-blue-50 text-2xl no-underline text-grey-darkest hover:text-blue-dark"
          >
            Home
          </Link>
        </div>
        <div>
          <Link
            to={"/instructions"}
            className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
          >
            Instructions{" "}
          </Link>
          <Link
            to={"/faq"}
            className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
          >
            F.A.Q.{" "}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
