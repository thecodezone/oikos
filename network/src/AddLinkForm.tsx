import React from 'react';
import {Button, ButtonGroup, defaultTheme, DialogContainer, Provider, TextField, useDialogContainer } from '@adobe/react-spectrum';
import { Item, ComboBox } from '@adobe/react-spectrum';
import { Form,  Content, Dialog } from '@adobe/react-spectrum';
import { Heading } from '@adobe/react-spectrum';
import {ToastContainer} from '@react-spectrum/toast'
import { AppData } from './components/AppWrapper';

export default function AddLinkForm() {
  const { linkDialog, closeLinkDialog } = AppData();

  return (
    <Provider theme={defaultTheme}>
      <ToastContainer />
      <DialogContainer onDismiss={() => closeLinkDialog()} type='modal'>
        {linkDialog === true && (
          <AddLinkDialog />
        )}
      </DialogContainer>
    </Provider>
  );
}

function AddLinkDialog() {
  const { addEdge, nodes, rightClickedNode } = AppData();
  let targetOptions = nodes
  let [targetID, setTargetID] = React.useState();
  let [relation, setRelation] = React.useState('');
  let dialog = useDialogContainer();
  
  function isDisabled() 
  {
    if (targetID === null || relation === ''){
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
    <Dialog size="S">
    <Heading>Link Adder</Heading>
      <Content>
        <Form validationBehavior="native" onSubmit={onSubmit} id="link-form">
          <p>(* is required)</p>
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
          <Button type="submit" variant="accent" isDisabled={isDisabled()} onPress={() => {addEdge(rightClickedNode, targetID, relation); handleClose(); dialog.dismiss();}}>Add Link</Button>
          <Button type="reset" variant="primary" onPress={dialog.dismiss}>Cancel</Button>
          </ButtonGroup>
        </Form>
      </Content>
    </Dialog>
  );
}