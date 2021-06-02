import React, { useContext } from 'react';
import { Context } from '../../State/Store';

export default function Toasts() {
  const [state, dispatch] = useContext(Context);

  const closeToast = (e) => {
    e.preventDefault();
    
    dispatch({type: 'REMOVE_TOAST', payload: e.target.value});
  }

  let typeToast;
  const toasts = state.toasts.map((toast, i) => {
    if (toast.code === 200) {
      typeToast = 'success';
    } else if (/^2/g.test(toast.code)) {
      typeToast = 'warning';
    } else {
      typeToast = 'danger';
    }
    
    return (
      <div key={i} className={'alert alert-'+ typeToast +' alert-dismissible fade show'}>
        <strong>{toast.message}</strong>
        <button
          type='button'
          value={toast.id}
          onClick={closeToast}
          className='close'
          data-dismiss='alert'
          aria-label='Close'>
        </button>
      </div>
    );
  });

  return (state.toasts && <div>{toasts}</div>);
}