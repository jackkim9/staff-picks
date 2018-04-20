// Library import
import React from 'react';
import PropTypes from 'prop-types';

const ListFilter = ({ fieldsetProps, handleChange }) => {
  const selectName = fieldsetProps.fieldsetName;
  const selectId = `${selectName}-input`;
  let defaultValue;
  const optionList = (fieldsetProps.options.length) ? fieldsetProps.options.map(
    (opt) => <option value={opt.value} key={opt.value}>{opt.name}</option>
  ) : null;

  if (fieldsetProps.currentValue) {
    defaultValue = fieldsetProps.currentValue;
  } else {
    defaultValue = (fieldsetProps.options.length && fieldsetProps.options[0].value) ?
      fieldsetProps.options[0].value : '';
  }

  return (
    <fieldset>
      <label htmlFor={selectId}></label>
      <select
        id={selectId}
        name={selectName}
        defaultValue={defaultValue}
        onChange={handleChange}
      >
       {optionList}
      </select>
    </fieldset>
  );
};

ListFilter.propTypes = {
  fieldsetProps: PropTypes.object,
  handleChange: PropTypes.func,
};

export default ListFilter;
