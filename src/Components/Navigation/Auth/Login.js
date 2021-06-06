import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import Toast from '../../../State/Consts/Toast';
import { Context } from '../../../State/Store';
import { Input } from '../../Forms/Elements';
import AuthHandler from '../../Services/AuthHandler';

const Login = (props) => {
  const { t } = useTranslation();
  const [, dispatch] = useContext(Context);

  const baseFormData = {
    'password': '',
    'email': '',
  };
  const [formData, setFormData] = useState(baseFormData);
  const [receivedValidationErrors, setReceivedValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState('');

  const handleChange = (e) => {
    e.preventDefault();

    let field = e.target.name;
    if (receivedValidationErrors.email) {
      setReceivedValidationErrors({});
    }
    setFormData({...formData, [field]: e.target.value});
  }

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
    dispatch({type: Toast.UNSET_ALL});
    AuthHandler.login(formData.email, formData.password)
      .then((response) => {
        setLoading(false);
        if (response.data.code === 200) {
          setFormData(baseFormData);
          props.setIsAuthenticated(true);
          if (props.location.state.returnTo) {
            setRedirect(props.location.state.returnTo);
          } else {
            setRedirect('/');
          }
        } else {
          if (response.data.data) {
            setReceivedValidationErrors(response.data.data);
          }
        }
        if (response.data.message && response.data.message !== '') {
          dispatch({type: Toast.ADD, payload: {
            id: 'Login',
            code: response.data.code,
            message: response.data.message
          }});
        } else {
          dispatch({type: Toast.REMOVE, payload: 'Login'});
        }
      },
      (error) => {
        setLoading(false);
      }
    );
  };

  if (redirect) {
    return <Redirect to={redirect} />
  }

  return (
    <div className='row justify-content-center py-4'>
      <h1>{t('login')}</h1>
      <form onSubmit={handleLogin} className='col-md-5'>
        <Input
          name='email'
          title={t('form.email')}
          value={formData.email}
          errors={receivedValidationErrors.email}
          handleChange={handleChange}
        />

        <Input
          name='password'
          type='password'
          title={t('form.password')}
          value={formData.password}
          errors={receivedValidationErrors.password}
          handleChange={handleChange}
        />

        <div className='form-group'>
          <button className='btn btn-primary btn-block' disabled={loading || receivedValidationErrors.email}>
            {loading && (
              <span className='spinner-border spinner-border-sm'></span>
            )}
            <span>{t('form.login')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;