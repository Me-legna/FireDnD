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

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='ul-nav' className='flex-center'>
      <li>
        <NavLink exact to="/">
          <img id='logo' src={require('../../images/fireDnD-logo.png')} alt='fireDnD-logo'></img>
        </NavLink>
      </li>
      <div id='query-filters'>
        <li className='nav-middle'>Search and Filter Modals incoming...</li>
      </div>
      <div id='nav-create-spot'>
        {sessionUser
          ? (
            <li className='create-spot nav-middle dropdown-item'>
              <OpenModalMenuItem
                itemText='fireDnD a Spot!'
                modalComponent={<CreateSpotFormModal />}
              />
            </li>
          )
          : (
            <li className='create-spot nav-middle dropdown-item' >
              <li className="dropdown-item">
                <OpenModalMenuItem
                  itemText="Sign Up"
                  modalComponent={<SignupFormModal />}
                />
              </li>
              <div className='dot-space'>/</div>
              <li className="dropdown-item">
                <OpenModalMenuItem
                  itemText="Log In"
                  modalComponent={<LoginFormModal />}
                />
              </li>
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
