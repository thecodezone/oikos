import React from 'react';
import {Button, ButtonGroup, defaultTheme, TextField, Provider, Checkbox, TextArea, DialogContainer, useDialogContainer} from '@adobe/react-spectrum';
import {Radio, RadioGroup} from '@adobe/react-spectrum';
import {View, Link, Form, Content, Dialog, DialogTrigger} from '@adobe/react-spectrum';
import {Divider, Header, Heading, Text} from '@adobe/react-spectrum';
import {ToastContainer} from '@react-spectrum/toast'
import {FieldError} from 'react-aria-components';
import { AppData } from '../components/AppWrapper';
import CustomFieldsMenu from '../components/contextMenus/CustomFieldsMenu';

export default function IndividualPrayerForm() {
  const { personDialog, closePersonDialog } = AppData();

  return (
    <Provider theme={defaultTheme}>
      <ToastContainer />
      <DialogContainer onDismiss={() => closePersonDialog()} type='modal'>
        {personDialog === true && (
          <AddPersonDialog />
        )}
      </DialogContainer>
    </Provider>
  );
}

type CustomField = { name: string; value: string; };

function AddPersonDialog() {
  let [name, setName] = React.useState('');
  let [phone, setPhone] = React.useState('');
  let [status, setStatus] = React.useState('');
  let [request, setRequest] = React.useState('');
  let [reminder, setReminder] = React.useState(false);
  const [customFields, setCustomFields] = React.useState<CustomField[]>([]);
  let dialog = useDialogContainer();

  const { addPerson } = AppData();

  function isDisabled() {
    return name === '' || status === '';
  }

  function handleClose() {
    setName('');
    setPhone('');
    setStatus('');
    setRequest('');
    setReminder(false);
    setCustomFields([]); // Reset custom fields on close
  }

  function addCustomField() {
    if (customFields.length < 4) {
      const fieldName = window.prompt("Enter the name for the custom field:");
      if (fieldName) {
        setCustomFields([...customFields, { name: fieldName, value: '' }]);
      }
    }
  }

  function updateCustomField(index, field, newValue) {
    setCustomFields(customFields.map((f, i) =>
      i === index ? { ...f, [field]: newValue } : f
    ));
  }
  
  const deleteCustomField = (index) => {
    const updatedCustomFields = customFields.filter((_, i) => i !== index);
    setCustomFields(updatedCustomFields);
  };

  let onSubmit = (e) => {
    e.preventDefault();
    addPerson(name, phone, status, request, reminder, customFields); // Include customFields
    handleClose();
    dialog.dismiss();
  };

  return (
    <Dialog size="S">
      <Heading>Pray for Someone</Heading>
      <Content>
        <Form validationBehavior="native" onSubmit={onSubmit} id="person-form">
          <p>(* is required)</p>
          <TextField name="name" value={name} onChange={setName} label="Subject Name" isRequired />
          <TextField name="phone" value={phone} onChange={setPhone} label="Phone Number" type="tel" inputMode="tel" />
          <RadioGroup name="status" value={status} onChange={setStatus} label="Subject Status" isRequired>
            <Radio value="believer">Believer</Radio>
            <Radio value="seeker">Seeker</Radio>
          </RadioGroup>
          <TextArea name="request" value={request} onChange={setRequest} label="Prayer Request" />
          <Checkbox name="reminder" isSelected={reminder} onChange={setReminder}>Add Prayer Reminder?</Checkbox>

          <CustomFieldsMenu
            customFields={customFields}
            updateCustomField={updateCustomField}
            deleteCustomField={deleteCustomField}
          />

          <Button onPress={addCustomField} variant="primary" isDisabled={customFields.length >= 4}>
            Add Custom Field
          </Button>

          <ButtonGroup>
            <Button type="submit" variant="accent" isDisabled={isDisabled()}>Add to map</Button>
            <Button type="reset" variant="primary" onPress={dialog.dismiss}>Cancel</Button>
          </ButtonGroup>
        </Form>
      </Content>
    </Dialog>
  );
}
