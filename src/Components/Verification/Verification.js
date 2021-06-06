import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Select } from '../Forms/Elements';
import Request from '../Services/Request';

export default function Verification(props) {
  const { t } = useTranslation();

  const baseFormData = {
    'verification_code': '',
  };
  const [formData, setFormData] = useState(baseFormData);
  // const [phones, setPhones] = useState([]);
  const [isPhonesCollected, setIsPhonesCollected] = useState(false);
  const [isForVerification, setIsForVerification] = useState(false);
  const [receivedValidationErrors, setReceivedValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();

    let field = e.target.name;
    if (receivedValidationErrors.verification_code) {
      setReceivedValidationErrors({});
    }
    setFormData({...formData, [field]: e.target.value});
  }

  let channelId;
  let options;
  const collectPhones = (phones) => {
    setIsPhonesCollected(true);

    if (phones.data && phones.data.length >= 1) {
      setIsForVerification(true);
      channelId = phones.data[0].id;
      setFormData({...formData, channel_id: channelId});

      if (phones.data.length >= 2) {
        options = phones.data;
      }
    }

    // setPhones(phones);
  }

  const sendForm = (e) => {
    e.preventDefault();

    setLoading(true);
  };

  return (
    <div className='row justify-content-center py-4'>
      <h1>{t('verification')}</h1>
      {loading && <Request
        method='patch'
        formData={formData}
        baseFormData={baseFormData}
        url={'users/channels/phones/verification'}
        toastId='PhoneVerification'
        setLoading={setLoading}
        setReceivedValidationErrors={setReceivedValidationErrors}
        setFormData={setFormData} />}
      {!isPhonesCollected && <Request
          method='get'
          formData={{}}
          url={'users/channels/phones'}
          setFormData={collectPhones} />}
      {isForVerification && <form onSubmit={sendForm} className='col-md-5'>
        {options && <Select
          name='channel_id'
          title={t('form.phone')}
          value={channelId}
          valueKey='id'
          label='number'
          options={options}
          handleChange={handleChange}
        />}
        <Input
          name='verification_code'
          title={t('form.verification_code')}
          value={formData.verification_code}
          errors={receivedValidationErrors.verification_code}
          handleChange={handleChange}
        />

        <div className='form-group'>
          <button className='btn btn-primary btn-block' disabled={loading || receivedValidationErrors.verification_code}>
            {loading && (
              <span className='spinner-border spinner-border-sm'></span>
            )}
            <span>{t('form.submit')}</span>
          </button>
        </div>
      </form>}
    </div>
  );
};