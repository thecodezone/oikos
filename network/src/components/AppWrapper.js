import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Person } from '../personModel'
import { Organization } from '../orgModel'
import {ToastQueue} from '@react-spectrum/toast'
import Graph from 'react-vis-network-graph';
import { options } from './options';
import NodeContextMenu from "./contextMenus/NodeContextMenu";
import EdgeContextMenu from "./contextMenus/EdgeContextMenu";
import CanvasContextMenu from "./contextMenus/CanvasContextMenu";

const AppContext = createContext()
export const AppData = () => useContext(AppContext)

export const AppWrapper = ({children}) => {
  // nodes, edges, and state
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

    const [rightClickedNode, setRightClickedNode] = useState(null);
    const [rightClickedEdge, setRightClickedEdge] = useState(null);

    function resetRightClickedNode() {
      setRightClickedNode(null);
    }
  
    function resetRightClickedEdge() {
      setRightClickedEdge(null);
    }

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
          },
          oncontext: (event) => {
            // redraw needed for event pointer to work (unexplained as to why)
            state.network.redraw();
            let nodeID = state.network.getNodeAt(event.pointer.DOM);
            let edgeID = state.network.getEdgeAt( event.pointer.DOM );
            const contextMenuAttr = contextMenuRef.current.getBoundingClientRect()
            const isLeft = event.pointer.DOM.x < window?.innerWidth / 2
            let xPos = event.pointer.DOM.x
            let yPos = event.pointer.DOM.y

            if (!isLeft) {
              xPos = xPos - contextMenuAttr.width
            }

            setPoints({
              x: xPos,
              y: yPos,
            })
            if (nodeID !== undefined) {
              console.log(`node selected: ${nodeID}`);
              setRightClickedNode(nodeID)
              resetRightClickedEdge()
              resetEdgeContextMenu()
              resetCanvasContextMenu()
              handleNodeOnContextMenu(event)
            }
            else if (edgeID !== undefined)
            {
              console.log(`edge selected: ${edgeID}`);
              setRightClickedEdge(edgeID)
              resetRightClickedNode()
              resetNodeContextMenu()
              resetCanvasContextMenu()
              handleEdgeOnContextMenu(event)
            }
            else
            {
              console.log(`canvas background selected`)
              resetRightClickedNode()
              resetRightClickedEdge()
              resetNodeContextMenu()
              resetEdgeContextMenu()
              handleCanvasOnContextMenu(event)
            }
          }
        },
        network: null
    })

    // methods
    const addPerson = (name, phone, status, request, reminder) => {
      if (name !== '' && status !== '')
      {
        name = adjustDuplicateName(name);
        let nodeShape = "box"
        if (status === 'believer')
        {
            nodeShape = "circle"
        }
        const newPerson = new Person(name, phone, status, request, reminder)
        const personEntry = {id: newPerson.getID(), label: name, shape: nodeShape};
        const arrayCopy = [...nodes]; //creating a copy
        arrayCopy.push(personEntry);
        setNodes(arrayCopy);
        updateNodeState(personEntry)
      }
      else
      {
        ToastQueue.negative('Missing required fields.', {timeout:1500});
      }
    };

    const addOrganization = (name, description, website, request, reminder) => {
      if (name !== '')
      {
        name = adjustDuplicateName(name);
        const newOrg = new Organization(name, description, website, request, reminder)
        const orgEntry = {id: newOrg.getID(), label: name, shape: "box"};
        const arrayCopy = [...nodes]; //creating a copy
        arrayCopy.push(orgEntry);
        setNodes(arrayCopy);
        updateNodeState(orgEntry);
      }
      else
      {
        ToastQueue.negative('Missing required fields.', {timeout:1500});
      }
    }

    const adjustDuplicateName = (name) => {
      let duplicateExists = false;
      let duplicateCount = 0;
      for (let i = 0; i<nodes.length; i++)
      {
        let tempName = nodes[i].label;
        if (tempName.includes(' ('))
        {
          tempName = nodes[i].label.substring(0, nodes[i].label.lastIndexOf(' '))
        }
        if (tempName === name)
        {
            duplicateExists = true;
            duplicateCount++;
        }
      }
      if (duplicateExists)
      {
        ToastQueue.info(' Duplicate name detected: ' + name + ' renamed to ' + name + ' (' + duplicateCount + ')', {timeout:1500});
        return name + ' (' + duplicateCount + ')';
      }
      else
      {
        return name;
      }
    }

    const updateNodeState = (node) => {
      // updates the nodes in the state with the new node
      setState(({ graph: { nodes, edges }, ...rest }) => {
          return {
            graph: {
              nodes: [
                ...nodes,
                node
              ],
              edges: [
                ...edges
              ]
            },
            ...rest
          }
      });
      ToastQueue.positive(node.label + ' successfully added to map', {timeout:1500});
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
  
    const deleteNode = (nodeID) => {
      const updatedNodes = nodes.filter(node => node.id !== nodeID);
      const updatedEdges = edges.filter(edge => edge.from !== nodeID && edge.to !== nodeID);
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setState(prevState => ({
        ...prevState,
        graph: {
          nodes: updatedNodes,
          edges: updatedEdges
        }
      }));
      ToastQueue.positive('Node deleted successfully.', {timeout: 1500});
    };

    const deleteEdge = (edgeID) => {
      const updatedEdges = edges.filter(edge => edge.id !== edgeID);
      setEdges(updatedEdges);
      setState(prevState => ({
        ...prevState,
        graph: {
          ...prevState.graph,
          edges: updatedEdges
        }
      }));
      ToastQueue.positive('Edge deleted successfully.', {timeout: 1500});
    };

    const setNetworkInstance = nw => {
      state.network = nw;
    };

    // context menus
    const contextMenuRef = useRef(null)
    const [points, setPoints] = useState({
        x: 0,
        y: 0,
    })
    const [nodeContextMenu, setNodeContextMenu] = useState({
      toggled: false
    })
    const [edgeContextMenu, setEdgeContextMenu] = useState({
      toggled: false
    })
    const [canvasContextMenu, setCanvasContextMenu] = useState({
      toggled: false
    })

    function handleNodeOnContextMenu(e) {
      setNodeContextMenu({
        toggled: true
      })
    }

    function handleEdgeOnContextMenu(e) {
      setEdgeContextMenu({
        toggled: true
      })
    }

    function handleCanvasOnContextMenu(e) {
      setCanvasContextMenu({
        toggled: true
      })
    }

    function resetPoints() {
      setPoints({
        x: 0,
        y: 0,
      })
    }

    function resetNodeContextMenu() {
      setNodeContextMenu({
        toggled: false
      })
    }

    function resetEdgeContextMenu() {
      setEdgeContextMenu({
        toggled: false
      })
    }

    function resetCanvasContextMenu() {
      setCanvasContextMenu({
        toggled: false
      })
    }

    useEffect(() => {
      function handler(e) {
        resetPoints()
        if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
          if (nodeContextMenu.toggled) {
              console.log('resetting node context menu')
              resetNodeContextMenu()
          } 
          else if (edgeContextMenu.toggled) {
              console.log('resetting edge context menu')
              resetEdgeContextMenu()
          } 
          else if (canvasContextMenu.toggled) {
              console.log('resetting canvas context menu')
              resetCanvasContextMenu()
          }
        }
      }

      document.addEventListener('click', handler)

      return () => {
        document.removeEventListener('click', handler)
      }
    })

    const [personDialog, setPersonDialog] = useState(false);

    function closePersonDialog() {
      setPersonDialog(false);
    }

    const [orgDialog, setOrgDialog] = useState(false);

    function closeOrgDialog() {
      setOrgDialog(false);
    }

    const [linkDialog, setLinkDialog] = useState(false);

    function closeLinkDialog() {
      setLinkDialog(false);
    }

    return (
        <AppContext.Provider value = {{state, nodes, edges, personDialog, 
                                      orgDialog, rightClickedNode, rightClickedEdge, linkDialog, addPerson, addOrganization, 
                                      addEdge, closePersonDialog, closeOrgDialog, resetRightClickedNode, resetRightClickedEdge,
                                      closeLinkDialog, deleteNode, deleteEdge}}>
            {children}
            <div className='container'
            onContextMenu={(e) => {
              e.preventDefault(); // prevent the default behaviour when right clicked
            }}>
              <Graph
                  graph = {state.graph}
                  options = {options}
                  events = {state.events}
                  getNetwork={setNetworkInstance}
              />
              <NodeContextMenu 
                contextMenuRef={contextMenuRef}
                isToggled={nodeContextMenu.toggled}
                positionX={points.x}
                positionY={points.y}
                buttons={[
                  {
                    text: "Add Link",
                    icon: "➕",
                    onClick: () => {setLinkDialog(true); resetNodeContextMenu()},
                  },
                  {
                    text: "Delete Node",
                    icon: "",
                    onClick: () => {deleteNode(rightClickedNode); resetNodeContextMenu()},
                  }
                ]}
              />
              <EdgeContextMenu
                contextMenuRef={contextMenuRef}
                isToggled={edgeContextMenu.toggled}
                positionX={points.x}
                positionY={points.y}
                buttons={[
                  {
                    text: "Delete Edge",
                    icon: "",
                    onClick: () => {deleteEdge(rightClickedEdge); resetEdgeContextMenu()},
                  },
                  {
                    text: "edge button 2",
                    icon: "",
                    onClick: () => alert("wow"),
                  },
                  {
                    text: "edge button 3",
                    icon: "",
                    onClick: () => alert("goodbye"),
                  }
                ]}
              />
              <CanvasContextMenu
                contextMenuRef={contextMenuRef}
                isToggled={canvasContextMenu.toggled}
                positionX={points.x}
                positionY={points.y}
                buttons={[
                  {
                    text: "Add a Person",
                    icon: "",
                    onClick: () => {setPersonDialog(true); resetCanvasContextMenu()},
                  },
                  {
                    text: "Add an Organization",
                    icon: "",
                    onClick: () => {setOrgDialog(true); resetCanvasContextMenu()},
                  }
                ]}
              />
            </div>
        </AppContext.Provider>
    )
}