import React from 'react';
import {
  Button,
  ButtonGroup,
  defaultTheme,
  TextField,
  Provider,
  Checkbox,
  TextArea,
  DialogContainer,
  useDialogContainer,
  MenuTrigger,
  Menu,
  Item,
  Heading
} from '@adobe/react-spectrum';
import { Radio, RadioGroup } from '@adobe/react-spectrum';
import { View, Form, Content, Dialog } from '@adobe/react-spectrum';
import { ToastContainer } from '@react-spectrum/toast';
import { AppData } from '../components/AppWrapper';
import CustomFieldsMenu from '../components/contextMenus/CustomFieldsMenu';

export default function IndividualPrayerForm() {
  const { personDialog, closePersonDialog } = AppData();

  return (
    <Provider theme={defaultTheme}>
      <ToastContainer />
      <DialogContainer onDismiss={() => closePersonDialog()} type="modal">
        {personDialog === true && <AddPersonDialog />}
      </DialogContainer>
    </Provider>
  );
}

type Field = { name: string; value: string };

function AddPersonDialog() {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [request, setRequest] = React.useState('');
  const [reminder, setReminder] = React.useState(false);
  const [customFields, setCustomFields] = React.useState<Field[]>([]);
  const [suggestedFields, setSuggestedFields] = React.useState<Field[]>([]);
  type CustomField = { name: string; value: string; };

  let dialog = useDialogContainer();
  const { addPerson } = AppData();

  const suggestedFieldOptions = [
    'Initial Contact Date',
    'Meeting Notes',
    'Age/Birthday',
    'Testimony',
    'Church Attendance',
  ];

  function isDisabled() {
    return name === '' || status === '';
  }

  function handleClose() {
    setName('');
    setPhone('');
    setStatus('');
    setRequest('');
    setReminder(false);
    setCustomFields([]);
    setSuggestedFields([]);
  }

  function addCustomField() {
    if (customFields.length < 4) {
      const fieldName = window.prompt('Enter the name for the custom field:');
      if (fieldName) {
        setCustomFields([...customFields, { name: fieldName, value: '' }]);
      }
    }
  }

  function addSuggestedField(fieldName) {
    if (!suggestedFields.some((field) => field.name === fieldName)) {
      setSuggestedFields([...suggestedFields, { name: fieldName, value: '' }]);
    }
  }

  function updateFieldValue(fields, setFields, index, newValue) {
    setFields(
      fields.map((field, i) => (i === index ? { ...field, value: newValue } : field))
    );
  }

  function deleteField(fields, setFields, index) {
    setFields(fields.filter((_, i) => i !== index));
  }

  let onSubmit = (e) => {
    e.preventDefault();
    addPerson(
      name,
      phone,
      status,
      request,
      reminder,
      [...customFields, ...suggestedFields]
    );
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
          <Checkbox name="reminder" isSelected={reminder} onChange={setReminder}>
            Add Prayer Reminder?
          </Checkbox>
          <>
          {/* Display Suggested Fields */}
          {suggestedFields.map((field, index) => (
            <View id="suggested-fields-container" key={`suggested-field-${index}`}>
              <TextField
                label={field.name}
                value={field.value}
                onChange={(newValue) =>
                  updateFieldValue(suggestedFields, setSuggestedFields, index, newValue)
                }
                id="text-field"
                width="100%"
              />
              <button
                type="button"
                onClick={() => deleteField(suggestedFields, setSuggestedFields, index)}
                className="delete-x"
                aria-label="Delete suggested field"
              >
                Delete Field
              </button>
            </View>
          ))}
          </>

          {/* Display Custom Fields */}
          <CustomFieldsMenu
            customFields={customFields}
            updateCustomField={(index, field, value) =>
              updateFieldValue(customFields, setCustomFields, index, value)
            }
            deleteCustomField={(index) =>
              deleteField(customFields, setCustomFields, index)
            }
          />

          {/* Add Suggested Fields Menu */}
          <MenuTrigger>
            <Button variant="primary" isDisabled={suggestedFields.length >= suggestedFieldOptions.length}>
              Add Suggested Fields
            </Button>
            <Menu onAction={(key) => addSuggestedField(key)} aria-label="Suggested Fields">
              {suggestedFieldOptions
                .filter((option) => !suggestedFields.some((field) => field.name === option))
                .map((option) => (
                  <Item key={option}>{option}</Item>
                ))}
            </Menu>
          </MenuTrigger>

          {/* Add Custom Field Button */}
          <Button onPress={addCustomField} variant="primary" isDisabled={customFields.length >= 4}>
            Add Custom Field
          </Button>

          <ButtonGroup>
            <Button type="submit" variant="accent" isDisabled={isDisabled()}>
              Add to map
            </Button>
            <Button type="reset" variant="primary" onPress={dialog.dismiss}>
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      </Content>
    </Dialog>
  );
}
