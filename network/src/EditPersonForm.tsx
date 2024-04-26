import React from 'react';
import {Button, ButtonGroup, defaultTheme, TextField, Provider, Checkbox, TextArea, DialogContainer, useDialogContainer} from '@adobe/react-spectrum';
import {Radio, RadioGroup} from '@adobe/react-spectrum';
import {Link, Form, Content, Dialog, DialogTrigger} from '@adobe/react-spectrum';
import {Divider, Header, Heading, Text} from '@adobe/react-spectrum';
import {ToastContainer} from '@react-spectrum/toast'
import {FieldError} from 'react-aria-components';
import { AppData } from './components/AppWrapper';

export default function EditIndividualPrayerForm() {
  const { editPersonDialog, closeEditPersonDialog } = AppData();

  return (
    <Provider theme={defaultTheme}>
      <ToastContainer />
      <DialogContainer onDismiss={() => closeEditPersonDialog()} type='modal'>
        {editPersonDialog === true && (
          <EditPersonDialog />
        )}
      </DialogContainer>
    </Provider>
  );
}

function EditPersonDialog() {
  const { editPerson, nodes, rightClickedNode } = AppData();
  let [name, setName] = React.useState(rightClickedNode.getName());
  let [phone, setPhone] = React.useState(rightClickedNode.getPhone());
  let [status, setStatus] = React.useState(rightClickedNode.getStatus());
  let [request, setRequest] = React.useState(rightClickedNode.getRequest());
  let [reminder, setReminder] = React.useState(rightClickedNode.getReminder());
  let [submitted, setSubmitted] = React.useState(null);
  let dialog = useDialogContainer();

  function isDisabled() {
    if (name === '' || status === ''){
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
    setPhone('');
    setStatus('');
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
      <Heading>Edit Person Details</Heading>
        <Content>
          <Form validationBehavior="native" onSubmit={onSubmit} id="person-form">
            <p>(* is required)</p>
            <p></p>
            <TextField name="name" value={name} onChange={setName} label="Subject Name" isQuiet isRequired necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
            <p></p>
            <TextField name="phone" value={phone} onChange={setPhone} label="Phone Number" 
              type='tel' inputMode='tel' isQuiet necessityIndicator="icon" 
              labelPosition="top" width="size-3000" maxWidth="100%"/>
            <p></p>
            <RadioGroup name="status" value={status} onChange={setStatus} 
              label="Subject Status" isRequired necessityIndicator='icon'>
              <Radio value="believer">Believer</Radio>
              <Radio value="seeker">Seeker</Radio>
              <FieldError/>
            </RadioGroup>
            <p></p>
            <TextArea name="request" value={request} onChange={setRequest} label="Prayer Request"  width="size-3000" maxWidth="100%" necessityIndicator="label" description="Enter request here..."/>
            <p></p>
            <Checkbox name="reminder" isSelected={reminder} onChange={setReminder}>Add Prayer Reminder?</Checkbox>
            <p></p>
            <ButtonGroup>
            <Button type="submit" variant="accent" isDisabled={isDisabled()}
              onPress={() => {editPerson(name, phone, status, request, reminder); 
                              handleClose(); 
                              dialog.dismiss()}}>Save Changes</Button>
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
                    <Text>Enter the name and information for the person you would like to pray for using the dialog.</Text>
                    </Content>
                </Dialog>
              </DialogTrigger>
            </ButtonGroup>
          </Form>
        </Content>
      </Dialog>
  )
}