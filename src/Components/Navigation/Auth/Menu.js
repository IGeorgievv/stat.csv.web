import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';

export default function Menu(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (e) => {
    props.clearToasts(e);
    setIsOpen(!isOpen);
  }

  if (props.isAuthenticated) {
    return (
      <ul className='navbar-nav ml-auto float-right pl-2'>
        <li className='nav-item'>
          <NavLink to='/' onClick={props.logOut} className='nav-link'>
            {props.t('logout')}
          </NavLink>
        </li>
      </ul>
    );
  }

  return (
    <div className='btn-group' role='group'>
      <button onClick={toggleMenu} type='button' className='btn btn-secondary dropdown-toggle btn-sm'>
        {props.t('profile')}
      </button>
      <div className={'dropdown-menu'+ (isOpen ? ' show' : '')}>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <NavLink to='/login' onClick={toggleMenu} className='nav-link'>
              {props.t('login')}
            </NavLink>
          </li>

          <li className='nav-item'>
            <NavLink to='/registration'
              onClick={toggleMenu}
              className='nav-link'
              activeClassName='active'>{props.t('registration')}</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}