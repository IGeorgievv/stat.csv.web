import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../../State/Store';
import { Input, Phone } from '../Forms/Elements';
import BreakLoop from '../../Exceptions/BreakLoop';
import Toast from '../../State/Consts/Toast';
import { Redirect } from 'react-router';

export default function Registration() {
  const { t } = useTranslation();
  const [, dispatch] = useContext(Context);

  const baseFormData = {
    'password': '',
    'email': '',
    'phone': {
      'country_code': 'BG',
      'number': ''
    }
  };
  const [formData, setFormData] = useState(baseFormData);
  const [receivedValidationErrors, setReceivedValidationErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL +'countries')
      .then(response => {
        if (response.data.code === 200) {
          setCountries(response.data.data);
        } else {
          if (response.data.message && response.data.message !== '') {
            dispatch({type: Toast.ADD, payload: {
              id: 'CountriesGet',
              code: response.data.code,
              message: response.data.message
            }});
          } else {
            dispatch({type: Toast.REMOVE, payload: 'CountriesGet'});
          }
        }
      }, error => {
        dispatch({type: Toast.ADD, payload: {
          id: 'CountriesGet',
          code: error.data.code,
          message: error.data.message
        }});
      });

    return function cleanup() {
      setCountries([]);
    };
  }, [dispatch]);

  const handleChange = (e) => {
    e.preventDefault();
    
    let field = e.target.name;
    if (receivedValidationErrors[field]) {
      let unresolvedValidationErrors = receivedValidationErrors;
      try {
        for (const errorKey in receivedValidationErrors) {
          if (errorKey === field) {
            delete unresolvedValidationErrors[errorKey];
            throw new BreakLoop('', 200);
          }
        }
      } catch (e) {
        if (!e instanceof BreakLoop) throw e;
      }
      setReceivedValidationErrors(unresolvedValidationErrors);
    }
    setFormData({...formData, [field]: e.target.value});
  }

  const handleChangePhone = (e) => {
    e.preventDefault();
    
    let field = e.target.name;
    if (receivedValidationErrors.phone && receivedValidationErrors.phone.number) { // Change in country code!
      let unresolvedValidationErrors = receivedValidationErrors;
      try {
        for (const errorKey in receivedValidationErrors.phone) {
          if (errorKey === 'number') {
            delete unresolvedValidationErrors.phone[errorKey];
            throw new BreakLoop('', 200);
          }
        }
      } catch (e) {
        if (!e instanceof BreakLoop) throw e;
      }
      setReceivedValidationErrors(unresolvedValidationErrors);
    }
    setFormData({...formData, phone: { ...formData.phone, [field]: e.target.value}});
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(process.env.REACT_APP_API_URL +'users', formData)
      .then(response => {
        if (response.data.code === 200) {
          setFormData(baseFormData);
          setRedirect('/login');
        } else {
          if (response.data.data) {
            setReceivedValidationErrors(response.data.data);
          }
        }
        if (response.data.message && response.data.message !== '') {
          dispatch({type: Toast.ADD, payload: {
            id: 'UserRegistration',
            code: response.data.code,
            message: response.data.message
          }});
        } else {
          dispatch({type: Toast.REMOVE, payload: 'UserRegistration'});
        }
      }, error => {
        if (error.data.data) {
          setReceivedValidationErrors(error.data.data);
        }
        dispatch({type: Toast.ADD, payload: {
          id: 'UserRegistration',
          code: error.data.code,
          message: error.data.message
        }});
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  if (redirect) {
    return <Redirect to={redirect} />
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
            name='number'
            value={formData.phone.number}
            errors={receivedValidationErrors.phone ? receivedValidationErrors.phone.number : null}
            select={{
              'name': 'country_code',
              'title': t('form.country'),
              'options': countries,
              'value': formData.phone.country_code
            }}
            title={t('form.phone')}
            id='phone'
            handleChange={handleChangePhone} />

          <div className='text-center'>
            <button type='submit' className='btn btn-primary'>{t('form.submit')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}