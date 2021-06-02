import React, { useState, useEffect } from 'react';

export function Input(props) {
  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.title}</label>
      <input
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        type={props.type ? props.type : 'text'}
        id={props.id}
        placeholder={props.placeholder}
        className='form-control' />

      <Errors errors={props.errors} />
    </div>
  );
}

export function InternalSelect(props) {
  const initOption = props.options.find(function(op) {
    return op.iso_code === props.value;
  });
  const [activeOption, setActiveOption] = useState(initOption);

  const [isOpen, setIsOpen] = useState(false);

  const selectOption = (e) => {
    e.preventDefault();

    const option = props.options.find(function (op) {
      return op.iso_code === e.currentTarget.dataset.iso_code;
    });
    if (!option) {
      return; // Error
    }
    
    setIsOpen(false);
    if (option.iso_code === activeOption.iso_code) {
      return;
    }

    e.target.name = props.name;
    e.target.value = option.iso_code;
    props.handleChange(e);
    setActiveOption(option);
  }

  const toggleMenu = (e) => {
    e.preventDefault();

    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const initOption = props.options.find(function(op) {
      return op.iso_code === props.value;
    });

    setActiveOption(initOption);
  }, [props.options, props.value]);

  if (!activeOption) {
    return null;
  }

  return (
    <div className='btn-group' role='group'>
      <div onClick={toggleMenu} type='button' className='btn btn-secondary dropdown-toggle btn-sm p-0 select-image'>
        <img src={activeOption.flag_url} alt={activeOption.iso_code} className='img-fluid' />
      </div>
      <input type='hidden' name={props.name} value={activeOption.iso_code} onChange={props.handleChange} />
      <ul className={'dropdown-menu select-image scrollable-menu'+ (isOpen ? ' show' : '')}>
        {props.options.map((option, i) => {     
          return (
            <li
              key={option.iso_code}
              data-iso_code={option.iso_code}
              onClick={selectOption}
              className={'dropdown-item p-0' + (props.value === option.iso_code ? ' disable' : '')}>
              <img src={option.flag_url} alt={option.iso_code} className='img-fluid' />
            </li>
          ) 
        })}
      </ul>
    </div>
  )
}

export function Errors(props) {
  const errors = [];
  for (const errorKey in props.errors) {
    const errorMessage = props.errors[errorKey];
    errors.push(<small>{errorMessage}<br/></small>);
  }
  return (
    errors.length >= 1 && <div className='alert alert-info p-1' role='alert'>
      {errors}
    </div>
  );
}

export function Phone(props) {
  return (
    <div className='form-group clearfix'>
      <label htmlFor={props.id}>{props.title}</label><br />
      <table className='w-100'>
        <tbody>
          <tr>
            <td className='select-image'>
              <InternalSelect 
                name={props.select.name}
                value={props.select.value}
                options={props.select.options}
                handleChange={props.handleChange} />
            </td>
            <td>
              <input
                name={props.name}
                value={props.value}
                onChange={props.handleChange}
                type={props.type ? props.type : 'text'}
                id={props.id}
                placeholder={props.placeholder}
                className='form-control' />
            </td>
          </tr>
        </tbody>
      </table>
      <Errors errors={props.errors} />
    </div>
  );
}