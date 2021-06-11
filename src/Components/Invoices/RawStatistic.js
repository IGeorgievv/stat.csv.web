import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, CombinedInput, Select } from '../Forms/Elements';
import BreakLoop from '../../Exceptions/BreakLoop';
import Request from '../Services/Request';

export default function RawStatistic() {
  const { t } = useTranslation();

  const baseCurrency = {
    code: 'GB',
    rate: 0
  };
  const baseFormData = {
    'currencies': [baseCurrency],
    'currency_code': 'GB',
    'client_vat': ''
  };
  const [formData, setFormData] = useState(baseFormData);
  const [vErrors, setVErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [currencyRates, setCurrencyRates] = useState([baseCurrency]);
  const [isCountriesCollected, setIsCountriesCollected] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();

    let field = e.target.name;
    if (vErrors[field]) {
      let unresolvedValidationErrors = vErrors;
      try {
        for (const errorKey in vErrors) {
          if (errorKey === field) {
            delete unresolvedValidationErrors[errorKey];
            throw new BreakLoop('', 200);
          }
        }
      } catch (e) {
        if (!e instanceof BreakLoop) throw e;
      }
      setVErrors(unresolvedValidationErrors);
    }

    setFormData({...formData, [field]: e.target.value});
  }

  const handleDeepChange = (block, position, uniqueField, errorField, e) => {
    e.preventDefault();

    let field = e.target.name;
    const existingSetting = formData[block].filter((component, i) => {
      return (position !== i && component[uniqueField] === formData[block][position][uniqueField]);
    });
    if (existingSetting.length >= 1) {
      setVErrors({...vErrors,
        block: {...vErrors[block],
            [position]: {[errorField]: ['The duplication is not allowed!']}}});
      return;
    }
    if (vErrors[block] && vErrors[block][position]) { // Change in country code!
      let blockErrors = vErrors[block][position];
      try {
        for (const errorKey in blockErrors) {
          if (errorKey === field) {
            delete blockErrors[block][position][field];
            throw new BreakLoop('', 200);
          }
        }
      } catch (e) {
        if (!e instanceof BreakLoop) throw e;
      }
      setVErrors({...vErrors, [block]: blockErrors});
    }

    let rate = {...formData[block][position]};
    rate[field] = e.target.value;
    formData[block][position] = rate;
    setFormData(formData);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmit(true);
  }

  const collectCountries = (countries) => {
    setIsCountriesCollected(true);

    const countriesFormatted = countries.map((country) => {
      return {
        label: country.flag,
        value: country.isoCode,
      };
    });
    setCountries(countriesFormatted);
  }

  const formResult = (response) => {
    setIsSubmit(false);
  }

  const addCurrency = (e) => {
    e.preventDefault();

    currencyRates.push(baseCurrency);
    setCurrencyRates(currencyRates);
    console.log(currencyRates)
  }

  const removeCurrency = (position, e) => {
    e.preventDefault();

    if (currencyRates.length === 1) {
      setVErrors({
        ...vErrors,
        currencies: [
          {
            rate: ['The service requires at least one rate!']
          }
        ]
      });
      return;
    }

    if (currencyRates[position]) {
      formData.currencies.forEach((currency, i) => {
        if (currency.code === currencyRates[position].code) {
          delete formData.currencies[i];
        }
      });

      delete currencyRates[position];
    }

    setFormData(formData);
    setCurrencyRates(currencyRates);
  }

  return (
    <div className='row justify-content-center py-4'>
      {isCountriesCollected && <form onSubmit={handleSubmit} className='col-md-5'>
        <Input
          title={t('form.vat')}
          name='client_vat'
          value={formData.client_vat}
          errors={vErrors.client_vat}
          handleChange={handleChange} />
        <Select
          title={t('form.currency')}
          name='currency_code'
          value={formData.currency_code}
          usesImage={true}
          options={countries}
          errors={vErrors.currency_code}
          handleChange={handleChange} />
        <h4>Exchange rates:</h4>
        {currencyRates.map((rate, i) => {
          return (<div>
            <CombinedInput
              key={i}
              name='rate'
              value={formData.currencies[i].rate}
              errors={vErrors.currencies && vErrors.currencies[i] ?
                vErrors.currencies[i].rate : null}
              select={{
                'name': 'code',
                'title': t('form.country'),
                'usesImage': true,
                'options': countries,
                'value': formData.currencies[i].code
              }}
              title={rate.title}
              handleChange={(e) => handleDeepChange('currencies', i, 'code', 'rate', e)} />
              <button type='button' className='btn btn-primary btn-sm' onClick={() => removeCurrency(i)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-node-minus-fill" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M16 8a5 5 0 0 1-9.975.5H4A1.5 1.5 0 0 1 2.5 10h-1A1.5 1.5 0 0 1 0 8.5v-1A1.5 1.5 0 0 1 1.5 6h1A1.5 1.5 0 0 1 4 7.5h2.025A5 5 0 0 1 16 8zm-2 0a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5A.5.5 0 0 0 14 8z"/>
                </svg>
              </button>
            </div>)
        })}
        <button type='button' className='btn btn-primary btn-sm' onClick={addCurrency}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-node-plus-fill" viewBox="0 0 16 16">
            <path d="M11 13a5 5 0 1 0-4.975-5.5H4A1.5 1.5 0 0 0 2.5 6h-1A1.5 1.5 0 0 0 0 7.5v1A1.5 1.5 0 0 0 1.5 10h1A1.5 1.5 0 0 0 4 8.5h2.025A5 5 0 0 0 11 13zm.5-7.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2a.5.5 0 0 1 1 0z"/>
          </svg>
        </button>

        <div className='text-center'>
          <button type='submit' className='btn btn-primary' disabled={isSubmit}>{t('form.submit')}</button>
        </div>
      </form>}
      {isSubmit && <Request
        method='patch'
        formData={formData}
        baseFormData={baseFormData}
        url={'invoices/stat'}
        toastId='InvoicesStat'
        setLoading={isSubmit}
        setVErrors={setVErrors}
        setFormData={formResult} />}
      {!isCountriesCollected && <Request
          method='get'
          formData={{}}
          url={'countries'}
          setLoading={setIsCountriesCollected}
          setFormData={collectCountries} />}
    </div>
  );
}