import React from 'react';
import {Button, ButtonGroup, defaultTheme, TextField, Provider, Checkbox, TextArea, DialogContainer, useDialogContainer} from '@adobe/react-spectrum';
import {Link, Form, Content, Dialog, DialogTrigger} from '@adobe/react-spectrum';
import {Divider, Header, Heading, Text} from '@adobe/react-spectrum';
import {ToastContainer} from '@react-spectrum/toast'
import { AppData } from './components/AppWrapper';

export default function EditOrgPrayerForm() {
  const { editOrgDialog, closeEditOrgDialog } = AppData();

  return (
    <Provider theme={defaultTheme}>
      <ToastContainer />
      <DialogContainer onDismiss={() => closeEditOrgDialog()} type='modal'>
        {editOrgDialog === true && (
          <EditOrgDialog />
        )}
      </DialogContainer>
    </Provider>
  );
}

function EditOrgDialog() {
  const { editOrganization, nodes, rightClickedNode } = AppData();
  let [name, setName] = React.useState(rightClickedNode.getName());
  let [description, setDescription] = React.useState(rightClickedNode.getDescription());
  let [website, setWebsite] = React.useState(rightClickedNode.getWebsite());
  let [request, setRequest] = React.useState(rightClickedNode.getRequest());
  let [reminder, setReminder] = React.useState(rightClickedNode.getReminder());
  let [submitted, setSubmitted] = React.useState(null);
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
          }>Save Changes</Button>
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