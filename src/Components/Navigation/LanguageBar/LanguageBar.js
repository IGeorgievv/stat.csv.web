import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

export default function LanguageBar(props) {
  const [languageCode, setLanguageCode] = useState('bg');
  const [isOpenLanguageMenu, setIsOpenLanguageMenu] = useState(false);

  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    e.preventDefault();
    setIsOpenLanguageMenu(false);
    setLanguageCode(e.target.value);
    i18n.changeLanguage(e.target.value);
  }

  const toggleLanguageMenu = (e) => {
    e.preventDefault();
    setIsOpenLanguageMenu(!isOpenLanguageMenu);
  }
  
  const list = [];
  for (let languageKey in props.languages) {
    let language = props.languages[languageKey];
    list.push(
      <button 
        key={language.code}
        value={language.code}
        onClick={changeLanguage}
        className={'dropdown-item' + (languageCode === language.code ? ' disable' : '')}
        disabled={languageCode === language.code}>
          {language.name}
      </button>
    )
  }

  return (
    <div className='btn-group' role='group'>
      <button onClick={toggleLanguageMenu} type='button' className='btn btn-secondary dropdown-toggle btn-sm'>
        {props.languages[languageCode].name}
      </button>
      <div className={'dropdown-menu'+ (isOpenLanguageMenu ? ' show' : '')}>
        {list}
      </div>
    </div>
  );
}