import React from 'react';
import {Button, ButtonGroup, defaultTheme, ListView, Provider, TextField, TableView, TableHeader, Row, Column, TableBody, Cell, DialogContainer, useDialogContainer} from '@adobe/react-spectrum';
import { Item, ComboBox } from '@adobe/react-spectrum';
import { Form, ActionButton,  Content, Dialog, DialogTrigger } from '@adobe/react-spectrum';
import { Heading } from '@adobe/react-spectrum';
import {ToastContainer} from '@react-spectrum/toast'
import { AppData } from '../components/AppWrapper';

export default function ViewListForm() {
  const { edges, nodes } = AppData();
  let columns = [
    { name: 'Name', uid: 'from' },
    { name: 'Connections', uid: 'to'},
  ];
  
  let nodeConnectionItems:{
    from: string;
    to: string;
  }[] = [];

  for(let i = 0; i < nodes.length;i++){
    let fromString = nodes[i].label
    let connection = ""
    for(let j = 0; j < edges.length; j++){
      if(edges[j].from === nodes[i].id){
        let toNodeName = nodes.find(x => x.id === edges[j].to).label;
        if(connection === ""){
          connection = toNodeName
        }
        else{
          connection = connection + ", " + toNodeName
        }
      }
    }
    let nodeConnectionItem = {id: i+1, from: fromString, to: connection};
      
    nodeConnectionItems.push(nodeConnectionItem);
    }
  

  let rows = nodeConnectionItems;

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
    <Provider theme={defaultTheme} id="listHeader">
      <ToastContainer />
      <DialogTrigger isDismissable mobileType='tray'>
        <ActionButton>View List</ActionButton>
        {( close ) => (
          <Dialog size="L">
          <Heading>Graph as List</Heading>
            <Content>
              <Form validationBehavior="native" onSubmit={onSubmit} id="link-form">
              <TableView
                flex
                aria-label="Example table with dynamic content"
                selectionMode='single'
                selectionStyle='highlight'
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <Column
                      key={column.uid}
                    >
                      {column.name}
                    </Column>
                  )}
                </TableHeader>
                <TableBody items={rows}>
                  {(item) => (
                    <Row>
                      {(columnKey) => <Cell>{item[columnKey]}</Cell>}
                    </Row>
                  )}
                </TableBody>
              </TableView>
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