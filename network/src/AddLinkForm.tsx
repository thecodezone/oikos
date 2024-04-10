import React from 'react';
import {Button, ButtonGroup, defaultTheme, Provider, TextField } from '@adobe/react-spectrum';
import { Item, ComboBox } from '@adobe/react-spectrum';
import { Form, ActionButton,  Content, Dialog, DialogTrigger } from '@adobe/react-spectrum';
import { Heading } from '@adobe/react-spectrum';
import {ToastContainer} from '@react-spectrum/toast'
import { AppData } from './components/AppWrapper';

export default function AddLinkForm() {
  const { addEdge, nodes } = AppData();
  let sourceOptions = nodes
  let targetOptions = nodes
  let [sourceID, setSourceID] = React.useState();
  let [targetID, setTargetID] = React.useState();
  let [relation, setRelation] = React.useState('');
  
  function isDisabled() 
  {
    if (sourceID === null || targetID === null || relation === ''){
      return true;
    }
    else
    {
      return false;
    }
  }

  function handleClose()
  {
    setRelation('');
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
    <Provider theme={defaultTheme}>
      <ToastContainer />
      <DialogTrigger isDismissable mobileType='tray'>
        <ActionButton>Add a Link</ActionButton>
        {( close ) => (
          <Dialog size="S">
          <Heading>Link Adder</Heading>
            <Content>
              <Form validationBehavior="native" onSubmit={onSubmit} id="link-form">
                <p>(* is required)</p>
                <p></p>
                <ComboBox isRequired
                    label="Source:"
                    items={sourceOptions}
                    onSelectionChange={setSourceID}>
                    {item => <Item>{item.label}</Item>}
                </ComboBox>
                <p></p>
                <ComboBox isRequired
                    label="Target:"
                    items={targetOptions}
                    onSelectionChange={setTargetID}>
                    {item => <Item>{item.label}</Item>}
                </ComboBox>
                <p></p>
                <TextField name="relation" value={relation} onChange={setRelation} label="Relation" isQuiet isRequired necessityIndicator="icon" labelPosition="top" width="size-3000" maxWidth="100%"/>
                <p></p>
                <ButtonGroup>
                <Button type="submit" variant="accent" isDisabled={isDisabled()} onPress={() => {addEdge(sourceID, targetID, relation); handleClose(); close();}}>Add Link</Button>
                <Button type="reset" variant="primary" onPress={close}>Cancel</Button>
                </ButtonGroup>
              </Form>
            </Content>
          </Dialog>
        )}
      </DialogTrigger>
    </Provider>
  );
}