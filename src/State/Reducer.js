const Reducer = (state, action) => {
  switch (action.type) {
      case 'SET_TOASTS':
        return {
          ...state,
          toasts: action.payload
        };
      case 'ADD_TOAST':
        const uniqueToasts = state.toasts.filter(toast => toast.id !== action.payload.id);
        return {
          ...state,
          toasts: uniqueToasts.concat(action.payload)
        };
      case 'REMOVE_TOAST':
        return {
          ...state,
          toasts: state.toasts.filter(toast => toast.id !== action.payload)
        };
      case 'UNSET_TOASTS':
        return {
          ...state,
          toasts: []
        };
      default:
        return state;
  }
};

export default Reducer;