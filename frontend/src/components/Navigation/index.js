// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
// import OpenModalButton from '../OpenModalButton';
import CreateSpotFormModal from '../SingleSpot/CreateSpotFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import logo from "../../images/fireDnD-logo.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const addDefaultSrc = (e) => {
		e.target.onerror = null; // prevents looping
		e.target.src = logo;
	};

  return (
    <ul id='ul-nav' className='flex-center'>
      <li>
        <NavLink exact to="/">
          <img id='logo' onError={addDefaultSrc} src={require('../../images/fireDnD-logo.png')} alt='fireDnD-logo'></img>
        </NavLink>
      </li>
      {/* <div id='query-filters'>
        <li className='nav-middle'>Search and Filter Modals incoming...</li>
      </div> */}
      <div id='nav-create-spot'>
        {sessionUser
          ? (
            <li className='create-spot nav-middle'>
              <OpenModalMenuItem
                itemText='FireDnD a Spot!'
                modalComponent={<CreateSpotFormModal />}
              />
            </li>
          )
          : (
            <li className='create-spot nav-middle dropdown-item' >
              <div className="dropdown-item">
                <OpenModalMenuItem
                  itemText="Sign Up"
                  modalComponent={<SignupFormModal />}
                />
              </div>
              <div className='dot-space'>/</div>
              <div className="dropdown-item">
                <OpenModalMenuItem
                  itemText="Log In"
                  modalComponent={<LoginFormModal />}
                />
              </div>
            </li>
          )
        }
      </div>
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </ul>
  );
}

export default Navigation;
