import axios from "axios";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import Toast from "../../State/Consts/Toast";
import { Context } from "../../State/Store";
import AuthHeader from "./AuthHeader";


export default function Request(props) {
  const [, dispatch] = useContext(Context);
  const [redirect, setRedirect] = useState();

  useEffect( () => {
    let _isMounted = true;
    axios({
      url: process.env.REACT_APP_API_URL + props.url,
      method: props.method,
      data: props.formData,
      headers: AuthHeader()
    })
    .then(
      (response) => {
        if (!_isMounted) {
          return;
        }

        if (response.data.code === 200) {
          if (props.returnTo) {
            setRedirect(props.returnTo);
            if (props.toastId) {
              dispatch({type: Toast.UNSET_ALL});
            }
          } else {
            props.setLoading(false);
            if (props.baseFormData) {
              props.setFormData(props.baseFormData);
            } else {
              props.setFormData(response.data);
            }
          }
        } else if (response.data.code === 401) {
          setRedirect('/login');
          if (props.toastId) {
            dispatch({type: Toast.UNSET_ALL});
          }
        } else {
          props.setLoading(false);
          if (response.data.data) {
            props.setReceivedValidationErrors(response.data.data);
          }
        }

        if (response.data.message && response.data.message !== '') {
          if (props.toastId) {
            dispatch({type: Toast.ADD, payload: {
              id: props.toastId,
              code: response.data.code,
              message: response.data.message
            }});
          }
        } else {
          if (props.toastId) {
            dispatch({type: Toast.REMOVE, payload: props.toastId});
          }
        }
      },
      (error) => {
        props.setLoading(false);
      }
    );

    return () => { _isMounted = false };
  });

  if (redirect) {
    return <Redirect to={{
        pathname: redirect,
        state: { returnTo: window.location.pathname }
      }} />;
  }

  return null;
}

Request.propTypes = {
  method: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  baseFormData: PropTypes.object,
  setFormData: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  setReceivedValidationErrors: PropTypes.func.isRequired,
  toastId: PropTypes.string,
  setLoading: PropTypes.func,
}

Request.defaultProps = {
  method: '',
  url: '',
  formData: {},
  setFormData: function(setState) {return setState;},
  setReceivedValidationErrors: function(setState) {return setState;},
  dispatch: function(setState) {return setState;},
  setLoading: function(setState) {return setState;},
}
