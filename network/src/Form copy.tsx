import React, { useCallback, useState } from 'react';
import { useRef } from "react";
import {Button, ButtonGroup, TextField, defaultTheme, Provider, Checkbox, TextArea, ListBox, Item, ComboBox, Picker, Radio, RadioGroup, Text} from '@adobe/react-spectrum';
import Collapsible from "react-collapsible";
import {Dialog, DialogTrigger, Heading, Input, Label, Modal, Form, FieldError} from 'react-aria-components';

export default function PrayerForm() {

  

  let [selectedKeys, setSelectedKeys] = useState(new Set());

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: '',
    request: '',
    notify: '',
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform validation checks on formData
    // If valid, submit the data
  };
  

  return (
    <DialogTrigger>
      <Button variant={'accent'}>Pray for Someone</Button>
      <Modal>
        <Dialog>
          <Form>
            <Heading slot="title">Pray for Someone</Heading>
            <Provider theme={defaultTheme}>
              <p></p>
              <TextField label="Subject Name" isRequired necessityIndicator="label" labelPosition="top" width="size-3000" placeholder="Joe Brown" value={formData.name} onChange={handleChange}/>
              <p></p>
              <TextField label="Location" isRequired necessityIndicator="label" labelPosition="top" width="size-3000" placeholder="Canada" value={formData.location} onChange={handleChange}/>
              <p></p>
              <RadioGroup name="status" label="Subject Status" isRequired necessityIndicator='label'>
                <Radio value="believer">Believer</Radio>
                <Radio value="non-believer">Non-Believer</Radio>
                <FieldError />
              </RadioGroup>
              <p></p>
              <TextArea label="Prayer Request" name="content" width='1000' necessityIndicator="label" placeholder="Enter request here..." value={formData.request} onChange={handleChange}/>
              <p></p>
              <Checkbox name="add reminder" value={formData.notify} onChange={handleChange}>Add Prayer Reminder?</Checkbox>
              <p></p>
              <ButtonGroup>
              <Button type="submit" variant="accent" onPress={() => alert(document.getElementById("username") + 'Successfully added to map')}>Add to map</Button>
              <Button type="reset" variant="secondary" onPress={() => alert('Form Cleared')}>Clear</Button>
              </ButtonGroup>
            </Provider>
          </Form>
      </Dialog>
    </Modal>
  </DialogTrigger>
  );
}