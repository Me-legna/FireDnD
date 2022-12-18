// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
// import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import DemoUserLogin from "../DemoUserLogin";
import SignupFormModal from '../SignupFormModal';
import OpenModalMenuItem from './OpenModalMenuItem'
import AllUserReviews from "../Reviews/AllUserReviews";
import CreateSpotFormModal from "../SingleSpot/CreateSpotFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button id="profile-button" onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div id="profile-dropdown">
            <li className="user-info">{user.username}</li>
            <li className="user-info">{user.firstName} {user.lastName}</li>
            <li className="user-info">{user.email}</li>
            <div>
              <li className="dropdown-item">
                <OpenModalMenuItem
                  itemText='FireDnD a Spot'
                  onItemClick={closeMenu}
                  modalComponent={<CreateSpotFormModal />}
                />
              </li>
              <li className="dropdown-item">
                <OpenModalMenuItem
                  itemText='Manage Reviews'
                  onItemClick={closeMenu}
                  modalComponent={<AllUserReviews />}
                />
              </li>
            </div>
            <div>
              <li>
                <button className="dropdown-item" onClick={logout}>Log Out</button>
              </li>
            </div>
          </div>
        ) : (
          <div id="profile-dropdown">
            <div>
              <li className="dropdown-item">
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </li>
              <li className="dropdown-item">
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </li>
            </div>
            <div>
              <li className="dropdown-item">
                <DemoUserLogin />
              </li>
            </div>
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
