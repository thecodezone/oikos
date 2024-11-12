import React from 'react';
import {Button, ButtonGroup, defaultTheme, TextField, Provider, Checkbox, TextArea, DialogContainer, useDialogContainer} from '@adobe/react-spectrum';
import {Radio, RadioGroup} from '@adobe/react-spectrum';
import {View, Link, Form, Content, Dialog, DialogTrigger} from '@adobe/react-spectrum';
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

// Define a type for the custom field(s)
type CustomField = { name: string; value: string; };

function EditPersonDialog() {
  const { editPerson, nodes, rightClickedNode } = AppData();
  const currentPerson = nodes.find(x => x.id === rightClickedNode).nodeInfo;
  let [name, setName] = React.useState(currentPerson.getName());
  let [phone, setPhone] = React.useState(currentPerson.getPhone());
  let [status, setStatus] = React.useState(currentPerson.getStatus());
  let [request, setRequest] = React.useState(currentPerson.getRequest());
  let [reminder, setReminder] = React.useState(currentPerson.getReminder());
  let [customFields, setCustomFields] = React.useState(currentPerson.getCustomFields() || []); 

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
  }

  function addCustomField() {
    if (customFields.length < 4) {
      const fieldName = window.prompt("Enter the name for the custom field:");
      if (fieldName) {
        setCustomFields([...customFields, { name: fieldName, value: '' }]);
      }
    }
  }

  function updateCustomField(index: number, field: 'name' | 'value', newValue: string) {
    setCustomFields(customFields.map((f, i) =>
      i === index ? { ...f, [field]: newValue } : f
    ));
  }

  const deleteCustomField = (index) => {
    const updatedCustomFields = customFields.filter((_, i) => i !== index);
    setCustomFields(updatedCustomFields);
  };

  let onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.currentTarget));
    
    currentPerson.setName(name);
    currentPerson.setPhone(phone);
    currentPerson.setStatus(status);
    currentPerson.setRequest(request);
    currentPerson.setReminder(reminder);
    currentPerson.setCustomFields(customFields); 

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
            <Button type="submit" variant="accent" isDisabled={isDisabled()}>Save</Button>
            <Button type="reset" variant="primary" onPress={dialog.dismiss}>Cancel</Button>
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