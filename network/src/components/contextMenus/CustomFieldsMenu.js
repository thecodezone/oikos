
import React from 'react';
import { View, TextField } from '@adobe/react-spectrum';

const CustomFieldList = ({ customFields, updateCustomField, deleteCustomField }) => {
  return (
    <>
      {customFields.map((field, index) => (
        <View key={index} id="custom-fields-container">
          <TextField
            name={`customFieldValue${index}`}
            value={field.value}
            onChange={(newValue) => updateCustomField(index, 'value', newValue)}
            label={`${field.name}`}
            id="text-field"
            width="100%"
          />
          <button 
            type="button"
            onClick={() => deleteCustomField(index)}
            className="delete-x"
            aria-label="Delete custom field"
          >
            Delete Field
          </button>
        </View>
      ))}
    </>
  );
};

export default CustomFieldList;
