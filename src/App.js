import './Theme/Bootstrap/bootstrap.scss';

import './Translations/i18n';

import Store from './State/Store';
import Toasts from './Components/Global/Toasts';
import RawStatistic from './Components/Invoices/RawStatistic';

function App() {

  return (
    <Store>
      <div className='container py-4'>
        <RawStatistic />
        <Toasts />
      </div>
    </Store>
  );
}

export default App;
