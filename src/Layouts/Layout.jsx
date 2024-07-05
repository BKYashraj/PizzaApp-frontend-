// eslint-disable-next-line react/prop-types
import PropTypes from "prop-types";

import Pizzalogo from "../assets/images/pizza1.png";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/Slices/AuthSlice";
import CartIcon from "../assets/images/cart.svg";
import { useEffect } from "react";
import { getCartDetails } from "../Redux/Slices/CartSlice";
function Layout({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  async function handleLogout(e) {
    e.preventDefault();
    dispatch(logout());
  }

  const { cartsData } = useSelector((state) => state.cart);
  
  useEffect(() => {
    dispatch(getCartDetails());
  },[]);

  const navigate = useNavigate();
  return (
    <div>
      <nav className="flex items-center justify-around h-16 text-[#6B7280] font-mono border-none shadow-md">
        <div
          className="flex items-center justify-center"
          onClick={() => navigate("/")}
        >
          <p>Pizza App</p>
          <img src={Pizzalogo} alt="Pizza logo" />
        </div>
        <div className="hidden md:block">
          <ul className="flex gap-4">
            <li className="hover:text-[#FF9110]">
              {" "}
              <p>Menu </p>
            </li>

            <li className="hover:text-[#FF9110]">
              {" "}
              <p>Services </p>
            </li>

            <li className="hover:text-[#FF9110]">
              {" "}
              <p>About </p>
            </li>
          </ul>
        </div>

        <div>
          <ul className="flex gap-4">
            <li className="hover:text-[#FF9110]">
              {isLoggedIn ? (
                <Link onClick={handleLogout}>Logout</Link>
              ) : (
                <Link to={"/auth/login"}>Login</Link>
              )}
            </li>

            {isLoggedIn && (
              <Link to={"/cart"}>
                <li>
                  <img src={CartIcon} className="w-8 h-8 inline" />{" "}
                  <p className="text-black inline">
                    {cartsData?.items?.length}
                  </p>
                </li>
              </Link>
            )}
          </ul>
        </div>
      </nav>

      {children}

      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Layout;
