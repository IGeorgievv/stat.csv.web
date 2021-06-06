import Toast from "./Consts/Toast";

const Reducer = (state, action) => {
  switch (action.type) {
      case Toast.SET_ALL:
        return {
          ...state,
          toasts: action.payload
        };
      case Toast.ADD:
        const uniqueToasts = state.toasts.filter(toast => toast.id !== action.payload.id);
        if (action.payload.message) {
          return {
            ...state,
            toasts: uniqueToasts.concat(action.payload)
          };
        }
        return {
          ...state,
          toasts: uniqueToasts
        };
      case Toast.REMOVE:
        return {
          ...state,
          toasts: state.toasts.filter(toast => toast.id !== action.payload)
        };
      case Toast.UNSET_ALL:
        return {
          ...state,
          toasts: []
        };
      default:
        return state;
  }
};

export default Reducer;