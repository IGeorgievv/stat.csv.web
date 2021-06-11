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

export function Select(props) {
  let options = props.options;
  if (!props.options) {
    options = [];
  }

  const initOption = options.find(function(op) {
    return op.value === props.value;
  });

  const [activeOption, setActiveOption] = useState(initOption);

  const [isOpen, setIsOpen] = useState(false);

  const selectOption = (e) => {
    e.preventDefault();

    const option = props.options.find(function (op) {
      return op.value === e.currentTarget.dataset.value;
    });
    if (!option) {
      return; // Error
    }

    setIsOpen(false);
    if (option.value === activeOption.value) {
      return;
    }

    e.target.name = props.name;
    e.target.value = option.value;
    props.handleChange(e);
    setActiveOption(option);
  }

  const toggleMenu = (e) => {
    e.preventDefault();

    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const initOption = options.find(function(op) {
      return op.value === props.value;
    });

    setActiveOption(initOption);
  }, [options, props.value]);

  if (!activeOption) {
    return null;
  }

  return (
    <div className='form-group'>
      <label>
        {props.title}
      </label>
      <div className='position-relative' role='group'>
        <div onClick={toggleMenu} className={'dropdown-toggle position-relative form-control'+ (isOpen ? ' show' : '')}>
          {props.usesImage && props.usesImage === true ?
            <img src={activeOption.label} alt="" className='img-fluid' /> :
            activeOption.label
          }
        </div>
        <ul className={'dropdown-menu scrollable-menu'+ (isOpen ? ' show' : '')}>
          {props.options.map((option, i) => {
            return (
              <li
                key={option.value}
                data-value={option.value}
                onClick={selectOption}
                className={'dropdown-item rounded' + (props.value === option.value ? ' disable' : '')}>
                {props.usesImage && props.usesImage === true ?
                  <img src={option.label} alt="" className='img-fluid' /> :
                  option.label
                }
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function InternalSelect(props) {
  const initOption = props.options.find(function(op) {
    return op.value === props.value;
  });
  const [activeOption, setActiveOption] = useState(initOption);

  const [isOpen, setIsOpen] = useState(false);

  const selectOption = (e) => {
    e.preventDefault();

    const option = props.options.find(function (op) {
      return op.value === e.currentTarget.dataset.value;
    });
    if (!option) {
      return; // Error
    }

    setIsOpen(false);
    if (option.value === activeOption.value) {
      return;
    }

    e.target.name = props.name;
    e.target.value = option.value;
    props.handleChange(e);
    setActiveOption(option);
  }

  const toggleMenu = (e) => {
    e.preventDefault();

    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const initOption = props.options.find(function(op) {
      return op.value === props.value;
    });

    setActiveOption(initOption);
  }, [props.options, props.value]);

  if (!activeOption) {
    return null;
  }

  return (
    <div className='btn-group' role='group'>
      <div onClick={toggleMenu} type='button' className='btn btn-secondary dropdown-toggle btn-sm p-0 select-image'>
        {props.usesImage && props.usesImage === true ?
          <img src={activeOption.label} alt="" className='img-fluid' /> :
          activeOption.label
        }
      </div>
      <ul className={'dropdown-menu select-image scrollable-menu'+ (isOpen ? ' show' : '')}>
        {props.options.map((option, i) => {
          return (
            <li
              key={option.value}
              data-value={option.value}
              onClick={selectOption}
              className={'dropdown-item p-0' + (props.value === option.value ? ' disable' : '')}>
              {props.usesImage && props.usesImage === true ?
                <img src={option.label} alt="" className='img-fluid' /> :
                option.label
              }
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function CombinedInput(props) {
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
                usesImage={props.select.usesImage}
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

export function Errors(props) {
  const errors = [];
  for (const errorKey in props.errors) {
    const errorMessage = props.errors[errorKey];
    errors.push(<small key={errorKey}>{errorMessage}<br/></small>);
  }
  return (
    errors.length >= 1 && <div className='alert alert-info p-1' role='alert'>
      {errors}
    </div>
  );
}