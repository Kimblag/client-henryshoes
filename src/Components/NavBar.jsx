import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import FormularioInicio from "./FormularioInicio";
import FormularioCrearCuenta from "./FormularioCrearCuenta";
import { NavContainer, Banner, LoginDiv, SearchNav } from "../styles/NavBar";
import banner from "../static/banner.png";
import Modal from "./Modal/Modal";
import { useModal } from "./Modal/hooks/useModal";
import { useDispatch, useSelector } from "react-redux";
import { LoginBtn, ChartBtn, DivStateCart } from "../styles/NavBar";
import {
  postLogOut,
  getShoppingCart,
  getCartBack,
} from "../redux/actions/index.js";
import "./ShoppingCart/ShoppingCart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

export default function NavBar() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  const cartDetail1 = useSelector((state) => state.shoppingCart);
  const cartDetailRegisterUser = useSelector(
    (state) => state.shoppingCartUserRegister
  );

  // console.log(cartDetailRegisterUser);
  const [stateCart, setStateCart] = useState();
  // console.log(stateCart);
  const resRemoveCart = useSelector((state) => state.RemoveBackShoppingCart);


  useEffect(() => {
    let sum = 0;

    if (cartDetail1) {
     sum=  cartDetail1.length;
      setStateCart(sum);
    }
    if (cartDetailRegisterUser && userInfo) {
      sum= cartDetailRegisterUser.length;
      setStateCart(sum);
    }
  }, [cartDetail1, cartDetailRegisterUser, userInfo]);//  eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(getShoppingCart());
  }, [cartDetail1, cartDetailRegisterUser]);//  eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userInfo) {
      dispatch(getCartBack(userInfo.email));
    }

  }, [cartDetail1, resRemoveCart])//  eslint-disable-line react-hooks/exhaustive-deps



  const signOutHandler = () => {
    dispatch(postLogOut());
    window.localStorage.removeItem("userInfo");
    navigate("/");
  };

  const [dropdown, setDropdown] = useState(false);
  const openCloseDropdown = () => setDropdown(!dropdown);

  const [isOpenLogin, openLogin, closeLogin] = useModal(false);
  const [isOpenCreateAccount, openCreateAccount, closeCreateAccount] =
    useModal(false);
  return (
    <>
      <NavContainer>
        <Banner>
          <Link to="/">
            <img src={banner} alt="" width="100%" height="150px" />
          </Link>
        </Banner>

        <SearchNav>
          <div>
            <SearchBar />
          </div>
          {stateCart !== 0 && <DivStateCart>{stateCart}</DivStateCart>}
          <div>
            {userInfo || userInfo === "you are not authenticated" ? null : (
              <LoginDiv>
                <LoginBtn onClick={openLogin}>Login</LoginBtn>
              </LoginDiv>
            )}

            {userInfo ? (
              <LoginDiv>
                <Dropdown isOpen={dropdown} toggle={openCloseDropdown}>
                  <DropdownToggle
                    style={{ background: "black", borderRadius: "0.75rem" }}
                    caret
                  >
                    {userInfo.name}
                  </DropdownToggle>

                  <DropdownMenu>
                      <Link
                        to="/profile"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                    <DropdownItem>
                        Profile
                    </DropdownItem>
                      </Link>
                      <Link
                        to="/wish-list"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                    <DropdownItem>
                        Wish List <FontAwesomeIcon icon={faHeart} />
                    </DropdownItem>
                      </Link>
                    <DropdownItem onClick={signOutHandler}>Logout</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                {/* <SignOutBtn onClick={signOutHandler}>Sign Out</SignOutBtn> */}
              </LoginDiv>
            ) : null}
          </div>
          <div>
            <Link to="/cart">
              <ChartBtn />
            </Link>
          </div>
        </SearchNav>
      </NavContainer>
      {/* los modals no estan afectando al css!! dejarlos ahi a lo ultimo */}
      <Modal isOpen={isOpenLogin} closeModal={closeLogin}>
        <FormularioInicio
          closeLogin={closeLogin}
          openCreateAccount={openCreateAccount}
        />
      </Modal>
      <Modal isOpen={isOpenCreateAccount} closeModal={closeCreateAccount}>
        <FormularioCrearCuenta closeCreateAccount={closeCreateAccount} />
      </Modal>
    </>
  );
}
