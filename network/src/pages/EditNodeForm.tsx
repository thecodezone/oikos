import React from 'react';
import {Button, ButtonGroup, defaultTheme, TextField, Provider, Checkbox, TextArea, DialogContainer, useDialogContainer} from '@adobe/react-spectrum';
import {Radio, RadioGroup} from '@adobe/react-spectrum';
import {View, Link, Form, Content, Dialog, DialogTrigger, Menu, MenuTrigger, Item} from '@adobe/react-spectrum';
import {Divider, Header, Heading, Text} from '@adobe/react-spectrum';
import {ToastContainer} from '@react-spectrum/toast'
import {FieldError} from 'react-aria-components';
import { AppData } from '../components/AppWrapper';
import CustomFieldsMenu from '../components/contextMenus/CustomFieldsMenu';

export default function EditNodeForm() {
  const { editNodeDialog, closeEditNodeDialog, selectedNodeType } = AppData();

  return (
    <Provider theme={defaultTheme}>
      <ToastContainer />
      <DialogContainer onDismiss={() => closeEditNodeDialog()} type='modal'>
        {editNodeDialog === true && selectedNodeType === 'person' && (
          <EditPersonDialog />
        )}
        {editNodeDialog === true && selectedNodeType === 'organization' && (
          <EditOrgDialog />
        )}
      </DialogContainer>
    </Provider>
  );
}

function EditPersonDialog() {
  type SuggestedField = { name: string; value: string };
  const { editPerson, nodes, rightClickedNode } = AppData();
  const currentPerson = nodes.find(x => x.id === rightClickedNode).nodeInfo;
  const [name, setName] = React.useState(currentPerson.getName());
  const [phone, setPhone] = React.useState(currentPerson.getPhone());
  const [status, setStatus] = React.useState(currentPerson.getStatus());
  const [request, setRequest] = React.useState(currentPerson.getRequest());
  const [reminder, setReminder] = React.useState(currentPerson.getReminder());
  const [customFields, setCustomFields] = React.useState(currentPerson.getCustomFields() || []);
  const [suggestedFields, setSuggestedFields] = React.useState<SuggestedField[]>([]);

  const suggestedFieldOptions = [
    'Initial Contact Date',
    'Meeting Notes',
    'Age/Birthday',
    'Testimony',
    'Church Attendance',
  ];

  let dialog = useDialogContainer();

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
      const fieldName = window.prompt("Enter the name for the custom field:");
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

  let onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    currentPerson.setName(name);
    currentPerson.setPhone(phone);
    currentPerson.setStatus(status);
    currentPerson.setRequest(request);
    currentPerson.setReminder(reminder);
    currentPerson.setCustomFields([...customFields, ...suggestedFields]);

    const personEntry = { id: currentPerson.getID(), label: currentPerson.getName(), shape: "box", nodeInfo: currentPerson };
    const arrayCopy = [...nodes];
    let nodeIndex = nodes.findIndex(obj => obj.id === rightClickedNode);
    arrayCopy[nodeIndex] = personEntry;

    handleClose();
    dialog.dismiss();
  };

  return (
    <Dialog size="S">
      <Heading>Edit Person Details</Heading>
      <Content>
        <Form onSubmit={onSubmit} id="person-form">
          <TextField name="name" value={name} onChange={setName} label="Subject Name" isRequired />
          <TextField name="phone" value={phone} onChange={setPhone} label="Phone Number" />
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
            <View key={`suggested-field-${index}`}>
              <TextField
                label={field.name}
                value={field.value}
                onChange={(newValue) =>
                  updateFieldValue(suggestedFields, setSuggestedFields, index, newValue)
                }
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
              Save
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

function EditOrgDialog() {
  const { editOrganization, nodes, rightClickedNode } = AppData();
  const currentOrganization = nodes.find(x => x.id === rightClickedNode).nodeInfo
  let [name, setName] = React.useState(currentOrganization.getName());
  let [description, setDescription] = React.useState(currentOrganization.getDescription());
  let [website, setWebsite] = React.useState(currentOrganization.getWebsite());
  let [request, setRequest] = React.useState(currentOrganization.getRequest());
  let [reminder, setReminder] = React.useState(currentOrganization.getReminder());
  //let [submitted, setSubmitted] = React.useState(null);
  let dialog = useDialogContainer();

  function isDisabled() 
  {
    if (name === ''){
      return true;
    }
    else
    {
      return false;
    }
  }

  function handleClose()
  {
    setName('');
    setDescription('');
    setWebsite('');
    setRequest('');
    setReminder(false);
  }

  let onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    let data = Object.fromEntries(new FormData(e.currentTarget));

    // Submit to your backend API...
    //setSubmitted(data);
  };
  
  return (
    <Dialog size="S">
    <Heading>Edit Organization Details</Heading>
      <Content>
        <Form validationBehavior="native" onSubmit={onSubmit} id="org-form">
          <p>(* is required)</p>
          <p></p>
          <TextField name="name" value={name} onChange={setName} label="Organization Name" isQuiet isRequired necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
          <p></p>
          <TextField name="type" value={description} onChange={setDescription} label="Type of Organization" isQuiet necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
          <p></p>
          <TextField name="website" value={website} onChange={setWebsite} label="Website Link/Contact Information" type='url' inputMode='url' isQuiet necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
          <p></p>
          <TextArea name="request" value={request} onChange={setRequest} label="Prayer Request"  width="size-3000" maxWidth="100%" necessityIndicator="label" description="Enter request here..."/>
          <p></p>
          <Checkbox name="reminder" isSelected={reminder} onChange={setReminder}>Add Prayer Reminder?</Checkbox>
          <p></p>
          <ButtonGroup>
          <Button type="submit" variant="accent" isDisabled={isDisabled()} onPress={
            () => { 
            editOrganization(name, description, website, request, reminder); handleClose();
            dialog.dismiss()}
          }>Save</Button>
          <Button type="reset" variant="primary" onPress={dialog.dismiss}>Cancel</Button>
            <DialogTrigger isDismissable type="popover">
              <Button variant="secondary">ⓘ</Button>
              <Dialog>
                  <Heading>Info</Heading>
                  <Header>
                    <Link><a href="//disciple.tools" target="_blank">Go to Disciple.Tools</a></Link>
                  </Header>
                  <Divider/>
                  <Content>
                  <Text>Enter the name and information for the organization/church you would like to pray for using the dialog.</Text>
                  </Content>
              </Dialog>
            </DialogTrigger>
          </ButtonGroup>
        </Form>
      </Content>
    </Dialog>
  );
}