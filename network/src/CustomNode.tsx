import React from 'react';
import {Button, ButtonGroup, defaultTheme, Provider, Picker, DialogContainer, useDialogContainer } from '@adobe/react-spectrum';
import { Item } from '@adobe/react-spectrum';
import { Form,  Content, Dialog } from '@adobe/react-spectrum';
import { Heading } from '@adobe/react-spectrum';
import {ColorWheel} from '@react-spectrum/color'
import {parseColor} from '@react-stately/color';
import {ToastContainer} from '@react-spectrum/toast'
import { AppData } from './components/AppWrapper';

export default function CustomNodeForm() {
  const { propertiesDialog, closePropertiesDialog } = AppData();

  return (
    <Provider theme={defaultTheme}>
      <ToastContainer />
      <DialogContainer onDismiss={() => closePropertiesDialog()} type='modal'>
        {propertiesDialog === true && (
          <PropertiesDialog />
        )}
      </DialogContainer>
    </Provider>
  );
}

function PropertiesDialog() {
  const { updateColorAndShape } = AppData();

  let [color, setColor] = React.useState(null);
  let [shape, setShape] = React.useState(null);
  let dialog = useDialogContainer();
  

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
    <Heading>Custom Node</Heading>
      <Content>
        <Form validationBehavior="native" onSubmit={onSubmit} id="link-form">
          <p></p>
          <ColorWheel onChangeEnd={(selected) => setColor(selected.toString('hsl'))}/>
          <p></p>
          <Picker label = "Choose Shape" id = "shapes"
          onSelectionChange={(selected) => setShape(selected)}>
              <Item key = "box">Box 🔲</Item>
              <Item key = "circle">Circle 🔘</Item>
              <Item key = "triangle">Triangle 🛆</Item>
          </Picker>
          <p></p>
          <ButtonGroup>
          <Button type="submit" variant="accent" onPress={() => {updateColorAndShape(color, shape); dialog.dismiss()}}>Submit</Button>
          <Button type="reset" variant="primary" onPress={dialog.dismiss}>Cancel</Button>
          </ButtonGroup>
        </Form>
      </Content>
    </Dialog>
  );
}