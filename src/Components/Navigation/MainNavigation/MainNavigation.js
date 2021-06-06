import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import LanguageBar from '../LanguageBar/LanguageBar';
import { Context } from '../../../State/Store';
import Toast from '../../../State/Consts/Toast';
import AuthHandler from '../../Services/AuthHandler';
import Menu from '../Auth/Menu';

export default function MainNavigation(props) {
  const { t } = useTranslation();
  const [, dispatch] = useContext(Context);

  const logOut = () => {
    AuthHandler.logout();
    props.setIsAuthenticated(false);
  };

  const clearToasts = (e) => {
    dispatch({type: Toast.UNSET_ALL});
  }

  return (
    <nav>
      <div className='container clearfix'>
        <div className='float-left'>
          <ul className='nav nav-tabs justify-content-center'>
            <li className='nav-item'>
              <NavLink exact to='/'
                onClick={clearToasts}
                className='nav-link'
                activeClassName='active'>{t('home')}</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/verification'
                onClick={clearToasts}
                className='nav-link'
                activeClassName='active'>{t('verification')}</NavLink>
            </li>
          </ul>
        </div>
        <div className='float-right p-2'>
          <LanguageBar
            languages={{
              'bg': {
                'code': 'bg',
                'name': 'БГ'
              },
              'en': {
                'code': 'en',
                'name': 'EN'
              }
            }}/>
          <Menu logOut={logOut} clearToasts={clearToasts} t={t} isAuthenticated={props.isAuthenticated} />
        </div>
      </div>
    </nav>
  );
}