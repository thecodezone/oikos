import { createContext, useContext, useState, useEffect } from "react";
import { Person } from '../personModel'
import { Organization } from '../orgModel'
import {ToastQueue} from '@react-spectrum/toast'

const AppContext = createContext()
export const AppData = () => useContext(AppContext)

export const AppWrapper = ({children}) => {
    const [nodes, setNodes] = useState([
        {id: 1, label: "Jayden", shape: "circle"},
        {id: 2, label: "Ryan", shape: "box"},
        {id: 3, label: "Amanda", shape: "box"},
        {id: 4, label: "Steffanie", shape: "circle"},
        {id: 5, label: "Aaron", shape: "circle"},
        {id: 6, label: "Malachi", shape: "circle"},
        {id: 7, label: "Zach", shape: "circle"},
        {id: 8, label: "Aven", shape: "box"},
        {id: 9, label: "Bitty", shape: "box"},
        {id: 10, label: "Joya", shape: "box"}
    ])
    const [edges, setEdges] = useState([
        {from: 1, to: 2, label: "Uncle"},
        {from: 2, to: 3, label: "Wife"},
        {from: 1, to: 4, label: "Mother"},
        {from: 1, to: 5, label: "Friend"},
        {from: 1, to: 6, label: "Friend"},
        {from: 1, to: 7, label: "Friend"},
        {from: 3, to: 8, label: "Child"},
        {from: 3, to: 9, label: "Child"},
        {from: 4, to: 10, label: "Friend"}
    ])

    const addPerson = (name, phone, status, request, reminder) => {
        var id = nodes.length + 1
        const newPerson = new Person(name, phone, status, request, reminder)
        const personEntry = {id: newPerson.getID(), label: name, shape: "box"};
        const arrayCopy = [...nodes]; //creating a copy
        arrayCopy.push(personEntry);
        setNodes(arrayCopy);
    };

    const addOrganization = (name, description, website, request, reminder) => {
        var id = nodes.length + 1
        const newOrg = new Organization(name, description, website, request, reminder)
        const orgEntry = {id: newOrg.getID(), label: name, shape: "box"};
        const arrayCopy = [...nodes]; //creating a copy
        arrayCopy.push(orgEntry);
        setNodes(arrayCopy);

    let [state, setState] = useState({
        graph: {nodes: nodes, edges: edges},
        events: {
            select: ({ nodes, edges }) => {
              //console.log("Selected nodes:");
              //console.log(nodes);
              //console.log("Selected edges:");
              //console.log(edges);
              //alert("Selected node: " + nodes);
            },
            doubleClick: ({ pointer: { canvas } }) => {
              //AlertDialog();
            }
          }
    })

    const addPerson = (name, followerStatus) => {
        if (name !== '' && followerStatus !== '')
        {
            // updates the nodes in the array
            let id = nodes.length + 1;
            let status = "box"
            if (followerStatus === 'believer')
            {
                status = "circle"
            }
            const newPerson = {id: id, label: name, shape: status};
            const arrayCopy = [...nodes];
            arrayCopy.push(newPerson);
            setNodes(arrayCopy);
            // updates the nodes in the state with the new node
            setState(({ graph: { nodes, edges }, ...rest }) => {
                return {
                  graph: {
                    nodes: [
                      ...nodes,
                      newPerson
                    ],
                    edges: [
                      ...edges
                    ]
                  },
                  ...rest
                }
            });
            ToastQueue.positive(name + ' successfully added to map', {timeout:1500});
        }
        else
        {
            ToastQueue.negative('Missing required fields.', {timeout:1500});
        }
    };

    const addEdge = (sourceID, targetID, label) => {
        if (sourceID !== null && targetID !== null && label !== '')
        {
            for (let i = 0; i<edges.length; i++)
            {
                if (edges[i].from === sourceID && edges[i].to === targetID)
                {
                    ToastQueue.info('Edge from ' + nodes.find(x => x.id === sourceID).label + 
                    ' to ' + nodes.find(x => x.id === targetID).label + ' already exists.', {timeout:1500})
                    return;
                }
            }
            // updates the edges array
            const newEdge = {from: sourceID, to: targetID, label: label};
            const arrayCopy = [...edges];
            arrayCopy.push(newEdge);
            setEdges(arrayCopy);
            // updates the edges in the state with the new edge
            setState(({ graph: { nodes, edges }, ...rest }) => {
                return {
                  graph: {
                    nodes: [
                      ...nodes
                    ],
                    edges: [
                      ...edges,
                      newEdge
                    ]
                  },
                  ...rest
                }
            });
            ToastQueue.positive('Successfully added link.', {timeout:1500});
        }
        else
        {
            ToastQueue.negative('Missing required fields.', {timeout:1500});
        }
    }

    return (
        <AppContext.Provider value = {{state, nodes, edges, addPerson, addOrganization, addEdge}}>
            {children}
        </AppContext.Provider>
    )
}