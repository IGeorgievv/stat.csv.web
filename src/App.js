import './Theme/Bootstrap/bootstrap.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import './Translations/i18n';

import Home from './Components/Home/Home';
import Registration from './Components/Registration/Registration';
import Verification from './Components/Verification/Verification';
import Store from './State/Store';
import Toasts from './Components/Global/Toasts';
import MainNavigation from './Components/Navigation/MainNavigation/MainNavigation';

function App() {

  return (
    <Store>
      <Router>
        <div>
          <MainNavigation />
          <div className='container py-4'>
            <Switch>
              <Route path='/registration'>
                <Registration />
              </Route>
              <Route path='/verification'>
                <Verification />
              </Route>
              <Route path='/'>
                <Home />
              </Route>
            </Switch>
            <Toasts />
          </div>
        </div>
      </Router>
    </Store>
  );
}

export default App;
