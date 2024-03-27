import React, {useRef, useCallback, useState} from 'react';
import {Button, ButtonGroup, defaultTheme, TextField, Provider, Checkbox, TextArea} from '@adobe/react-spectrum';
import {ListBox, Item, ComboBox, Picker, Radio, RadioGroup, ProgressCircle} from '@adobe/react-spectrum';
import {Link, Form, ToggleButton, ActionButton,  Content, Dialog, DialogTrigger} from '@adobe/react-spectrum';
import {Divider, Header, Heading, Text} from '@adobe/react-spectrum';
import {ToastContainer, ToastQueue} from '@react-spectrum/toast'
import {Input, Label, Modal, FieldError, OverlayArrow, Popover} from 'react-aria-components';
import { AppData } from './components/AppWrapper';

export default function OrgPrayerForm() {
  let [name, setName] = React.useState('');
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
        <ActionButton>Add an Organization</ActionButton>
        {( close ) => (
          <Dialog size="S">
          <Heading>Pray for an Organization</Heading>
            <Content>
              <Form validationBehavior="native" onSubmit={onSubmit} id="prayer-form">
                <p></p>
                <TextField name="name" value={name} onChange={setName} label="Organization Name" isQuiet isRequired necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
                <p></p>
                <TextField name="description" label="Description of Organization" isQuiet isRequired necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
                <p></p>
                <TextField name="website" label="Website Link/Contact Information" isQuiet isRequired necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
                <p></p>
                <TextArea name="request" label="Prayer Request"  width="size-3000" maxWidth="100%" necessityIndicator="label" placeholder="Enter request here..."/>
                <p></p>
                <Checkbox name="reminder">Add Prayer Reminder?</Checkbox>
                <p></p>
                <ButtonGroup>
                <Button type="submit" variant="accent" onPress={() => {ToastQueue.positive(name + ' successfully added to map', {timeout:1500}); addPerson(name); close()}}>Add to map</Button>
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
                        <Text>Enter the name and information for the organization/church you would like to pray for using the dialog.</Text>
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