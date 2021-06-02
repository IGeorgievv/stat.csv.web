import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import LanguageBar from '../LanguageBar/LanguageBar';
import { Context } from '../../../State/Store';

export default function MainNavigation(props) {
  const { t } = useTranslation();
  const [, dispatch] = useContext(Context);

  const clearToasts = (e) => {
    dispatch({type: 'UNSET_TOASTS'});
  }

  return (
    <nav>
      <div className='container clearfix'>
        <div className='float-left'>
          <ul className='nav nav-tabs justify-content-center'>
            <li className='nav-item'>
              <NavLink exact to='/' onClick={clearToasts} className='nav-link' activeClassName='active'>{t('home')}</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/registration' onClick={clearToasts} className='nav-link' activeClassName='active'>{t('registration')}</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/verification' onClick={clearToasts} className='nav-link' activeClassName='active'>{t('verification')}</NavLink>
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
        </div>
      </div>
    </nav>
  );
}