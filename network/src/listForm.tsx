import React from 'react';
import {Button, ButtonGroup, defaultTheme, ListView, Provider, TextField } from '@adobe/react-spectrum';
import { Item, ComboBox } from '@adobe/react-spectrum';
import { Form, ActionButton,  Content, Dialog, DialogTrigger } from '@adobe/react-spectrum';
import { Heading } from '@adobe/react-spectrum';
import {ToastContainer} from '@react-spectrum/toast'
import { AppData } from './components/AppWrapper';

export default function ViewListForm() {
  const { nodes } = AppData();
  let rows = nodes;

  let [selectedKeys, setSelectedKeys] = React.useState();


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
        <ActionButton>View List</ActionButton>
        {( close ) => (
          <Dialog size="S">
          <Heading>Graph as List</Heading>
            <Content>
              <Form validationBehavior="native" onSubmit={onSubmit} id="link-form">
               <ListView maxWidth="size-6000" 
               aria-label="ListView with controlled selection" 
               selectionStyle="highlight"
               selectionMode="single"
               items={rows}
               selectedKeys={selectedKeys}
               onSelectionChange={setSelectedKeys}>
               {(item) => (
                    <Item>
                    {item.label}
                    </Item>
                )}
                </ListView>
                <p></p>
                <ButtonGroup>
                <Button type="reset" variant="primary" onPress={close}>Close</Button>
                </ButtonGroup>
              </Form>
            </Content>
          </Dialog>
        )}
      </DialogTrigger>
    </Provider>
  );
}