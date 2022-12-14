// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='ul-nav'>
      <li>
        <NavLink exact to="/">
          <img id='logo' src={require('../../assets/fireDnD-logo.png')} alt='fireDnD-logo'></img>
        </NavLink>
      </li>
      <div id='query-filters'>
        <li className='nav-middle'>QueryFilterModals?</li>
      </div>
      <div id='nav-create-spot'>
        <li className='create-spot nav-middle'>Create a Spot?</li>
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
