import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../../State/Store';
import { Input, Phone } from '../Forms/Elements';

export default function Registration() {
  const { t } = useTranslation();
  const [, dispatch] = useContext(Context);

  const baseFormData = {
    'password': '',
    'email': '',
    'phone_country_code': 'BG',
    'phone': ''
  };
  const [formData, setFormData] = useState(baseFormData);
  const [receivedValidationErrors, setReceivedValidationErrors] = useState({});
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL +'countries')
      .then(response => {
        setCountries(response.data.data);
      }, error => {
        dispatch({type: 'ADD_TOAST', payload: {
          id: 'CountriesGet',
          code: error.data.code,
          message: error.data.message
        }});
        console.log(error);
      });

    return function cleanup() {
      setCountries([]);
    };
  }, [dispatch]);

  const handleChange = (e) => {
    e.preventDefault();
    
    if (receivedValidationErrors[e.target.name]) {
      let unresolvedValidationErrors = receivedValidationErrors;
      try {
        for (const errorKey in receivedValidationErrors) {
          if (errorKey === e.target.name) {
            delete unresolvedValidationErrors[errorKey];
            throw 'Break';
          }
        }
      } catch (e) {
        if (e !== 'Break') throw e;
      }
      setReceivedValidationErrors(unresolvedValidationErrors);
    }
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(process.env.REACT_APP_API_URL +'users', formData)
      .then(response => {
        if (response.data.code === 200) {
          setFormData(baseFormData);
        } else {
          setReceivedValidationErrors(response.data.data);
        }
        dispatch({type: 'ADD_TOAST', payload: {
          id: 'UserRegistration',
          code: response.data.code,
          message: response.data.message
        }});
      }, error => {
        if (error.data.data) {
          setReceivedValidationErrors(error.data.data);
        }
        dispatch({type: 'ADD_TOAST', payload: {
          id: 'UserRegistration',
          code: error.data.code,
          message: error.data.message
        }});
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  return (
    <div>
      <h1>{t('registration')}</h1>

      <div className='row justify-content-center py-4'>
        <form onSubmit={handleSubmit} className='col-md-5'>
          <Input
            name='email'
            value={formData.email}
            errors={receivedValidationErrors.email}
            title={t('form.email')}
            id='email'
            handleChange={handleChange} />
          <Input
            name='password'
            value={formData.password}
            errors={receivedValidationErrors.password}
            title={t('form.password')}
            id='password'
            type='password'
            handleChange={handleChange} />
          <Phone
            name='phone'
            value={formData.phone}
            errors={receivedValidationErrors.phone}
            select={{
              'name': 'phone_country_code',
              'title': t('form.country'),
              'options': countries,
              'value': formData.phone_country_code
            }}
            title={t('form.phone')}
            id='phone'
            handleChange={handleChange} />

          <div className='text-center'>
            <button type='submit' className='btn btn-primary'>{t('form.submit')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}