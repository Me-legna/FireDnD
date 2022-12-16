// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalButton from '../OpenModalButton';
import CreateSpotFormModal from '../SingleSpot/CreateSpotFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='ul-nav' className='flex-center'>
      <li>
        <NavLink exact to="/">
          <img id='logo' src={require('../../assets/fireDnD-logo.png')} alt='fireDnD-logo'></img>
        </NavLink>
      </li>
      <div id='query-filters'>
        <li className='nav-middle'>QueryFilterModals?</li>
      </div>
      <div id='nav-create-spot'>
        { sessionUser
        ? (
        <li className='create-spot nav-middle dropdown-item'>
          <OpenModalMenuItem
          itemText='fireDnD a Spot!'
          modalComponent={<CreateSpotFormModal />}
          />
          </li>
          )
          : (
            <li className='create-spot nav-middle' >{'Login/Sign Up To fireDnD a Spot --->'}</li>
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
