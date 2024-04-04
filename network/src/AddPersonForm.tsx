import React, {useRef, useCallback, useState} from 'react';
import {Button, ButtonGroup, defaultTheme, TextField, Provider, Checkbox, TextArea} from '@adobe/react-spectrum';
import {ListBox, Item, ComboBox, Picker, Radio, RadioGroup, ProgressCircle} from '@adobe/react-spectrum';
import {Link, Form, ToggleButton, ActionButton,  Content, Dialog, DialogTrigger} from '@adobe/react-spectrum';
import {Divider, Header, Heading, Text} from '@adobe/react-spectrum';
import {ToastContainer, ToastQueue} from '@react-spectrum/toast'
import {Input, Label, Modal, FieldError, OverlayArrow, Popover} from 'react-aria-components';
import { AppData } from './components/AppWrapper';

export default function IndividualPrayerForm() {
  let [name, setName] = React.useState('');
  let [phone, setPhone] = React.useState('');
  let [status, setStatus] = React.useState('');
  let [request, setRequest] = React.useState('');
  let [reminder, setReminder] = React.useState(false);
  let [submitted, setSubmitted] = React.useState(null);
  const { addPerson } = AppData();

  let onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    let data = Object.fromEntries(new FormData(e.currentTarget));

    // Submit to your backend API...
    //setSubmitted(data);
  };
  
  return (
    <Provider theme={defaultTheme}>
      <ToastContainer />
      <DialogTrigger isDismissable mobileType='tray'>
        <ActionButton>Add a Person</ActionButton>
        {( close ) => (
          <Dialog size="S">
          <Heading>Pray for Someone</Heading>
            <Content>
              <Form validationBehavior="native" onSubmit={onSubmit} id="prayer-form">
                <p></p>
                <TextField name="name" value={name} onChange={setName} label="Subject Name" isQuiet isRequired necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
                <p></p>
                <TextField name="phone" value={phone} onChange={setPhone} label="Phone Number" type='tel' inputMode='tel' isQuiet isRequired necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
                <p></p>
                <RadioGroup name="status" value={status} onChange={setStatus} label="Subject Status" isRequired necessityIndicator='icon'>
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
                <Button type="submit" variant="accent" onPress={() => {ToastQueue.positive(name + ' successfully added to map', {timeout:1500}); addPerson(name, phone, status, request, reminder); close()}}>Add to map</Button>
                <Button type="reset" variant="primary" onPress={close}>Cancel</Button>
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
        )}
      </DialogTrigger>
    </Provider>
  );
}