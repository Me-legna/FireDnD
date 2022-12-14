// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as sessionActions from './store/session'
import Navigation from "./components/Navigation";
import AllSpots from './components/AllSpots';
import './App.css'
import SingleSpot from './components/SingleSpot';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

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
        </Switch>
      )}
    </>
  );

}

export default App;
