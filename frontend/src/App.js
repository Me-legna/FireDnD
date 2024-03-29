// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as sessionActions from './store/session'
import Navigation from "./components/Navigation";
import AllSpots from './components/AllSpots';
import './App.css'
import SingleSpot from './components/SingleSpot';
import NotFoundPage from './components/404Page';
import Reviews from './components/Reviews';
import { getUserBookings } from './store/bookings';

function App() {
  const user = useSelector(state => state.session.user)
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
		if (user) dispatch(getUserBookings());
	}, [dispatch, user]);

  return (
    <>
        <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
            <Route exact path='/'>
              <AllSpots />
            </Route>

            <Route path='/spots/:id'>
              <SingleSpot />
            </Route>

            <Route path='/'>
                <NotFoundPage />
            </Route>
        </Switch>
      )}
    </>
  );

}

export default App;
