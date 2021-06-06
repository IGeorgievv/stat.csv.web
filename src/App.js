import './Theme/Bootstrap/bootstrap.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './Translations/i18n';

import Home from './Components/Home/Home';
import Registration from './Components/Registration/Registration';
import Verification from './Components/Verification/Verification';
import Store from './State/Store';
import Toasts from './Components/Global/Toasts';
import MainNavigation from './Components/Navigation/MainNavigation/MainNavigation';
import GuardRoute from './Components/Services/GuardRoute';
import { useState } from 'react';
import Login from './Components/Navigation/Auth/Login';
import AuthHandler from './Components/Services/AuthHandler';

function App() {
  const existingSession = AuthHandler.getCurrentUser() ? true : false;
  const [isAuthenticated, setIsAuthenticated] = useState(existingSession);

  return (
    <Store>
      <Router>
        <div>
          <MainNavigation isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <div className='container py-4'>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/login'
                render={(props) => (<Login {...props} setIsAuthenticated={setIsAuthenticated} />)} />
              <Route path='/registration' component={Registration} />
              <GuardRoute path='/verification' component={Verification} auth={isAuthenticated} />
            </Switch>
            <Toasts />
          </div>
        </div>
      </Router>
    </Store>
  );
}

export default App;
