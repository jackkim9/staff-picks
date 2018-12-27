// Library import
import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../utils/utils';

import {
  FormGroup,
  Select,
  SelectItem,
} from "carbon-components-react";

const ListFilter = ({ fieldsetProps, handleChange }) => {
  const selectName = fieldsetProps.fieldsetName;
  const selectId = `${selectName}-input`;
  let defaultValue;
  const optionList = (fieldsetProps.options.length) ? fieldsetProps.options.map(
    opt => <option value={opt.value} key={opt.value}>{opt.name}</option>,
  ) : null;
  const opList = (fieldsetProps.options.length) ? fieldsetProps.options.map(
    opt => <SelectItem value={opt.value} key={opt.value} text={opt.name} />,
  ) : null;

  if (fieldsetProps.currentValue) {
    defaultValue = fieldsetProps.currentValue;
  } else {
    defaultValue = (fieldsetProps.options.length && fieldsetProps.options[0].value) ?
      fieldsetProps.options[0].value : '';
  }

  // <select
  //   id={selectId}
  //   name={selectName}
  //   value={defaultValue}
  //   onChange={handleChange}
  // >
  //   {optionList}
  // </select>
  return (
    <FormGroup legendText={`Select ${utils.capitalize(selectName)}`}>
      <Select
        className="some-class"
        invalidText="A valid selection is required"
        id={selectId}
        onChange={handleChange}
        light
      >
        {opList}
      </Select>
    </FormGroup>
  );
};

ListFilter.propTypes = {
  fieldsetProps: PropTypes.object,
  handleChange: PropTypes.func,
};

export default ListFilter;
