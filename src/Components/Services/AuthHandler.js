import axios from 'axios';

const login = (email, password) => {
  return axios
    .post(process.env.REACT_APP_API_URL +'login', {
      email,
      password,
    })
    .then((response) => {
      if (response.data.code === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }

      return response;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const AuthHandler = {
  login,
  logout,
  getCurrentUser,
};

export default AuthHandler;