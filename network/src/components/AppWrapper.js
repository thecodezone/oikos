import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Person } from '../js/personModel'
import { Organization } from '../js/orgModel'
import {ToastQueue} from '@react-spectrum/toast'
import Graph from 'react-vis-network-graph';
import { options } from './options';
import NodeContextMenu from "./contextMenus/NodeContextMenu";
import EdgeContextMenu from "./contextMenus/EdgeContextMenu";
import CanvasContextMenu from "./contextMenus/CanvasContextMenu";
import { v4 as uuidv4 } from 'uuid'

const AppContext = createContext()
export const AppData = () => useContext(AppContext)

export const AppWrapper = ({children}) => {
  // hardcoded fillers for the example nodes
  const jayden = new Person('Jayden')
  const ryan = new Person('Ryan')
  const amanda = new Person('Amanda')
  const steffanie = new Person('Steffanie')
  const aaron = new Person('Aaron')
  const malachi = new Person('Malachi')
  const zach = new Person('Zach')
  const aven = new Person('Aven')
  const bitty = new Person('Bitty')
  const joya = new Person('Joya')
  // nodes, edges, and state
    const [nodes, setNodes] = useState([
        {id: jayden.getID(), label: "Jayden", shape: "circle", nodeInfo: jayden},
        {id: ryan.getID(), label: "Ryan", shape: "box", nodeInfo: ryan},
        {id: amanda.getID(), label: "Amanda", shape: "box", nodeInfo: amanda},
        {id: steffanie.getID(), label: "Steffanie", shape: "circle", nodeInfo: steffanie},
        {id: aaron.getID(), label: "Aaron", shape: "circle", nodeInfo: aaron},
        {id: malachi.getID(), label: "Malachi", shape: "circle", nodeInfo: malachi},
        {id: zach.getID(), label: "Zach", shape: "circle", nodeInfo: zach},
        {id: aven.getID(), label: "Aven", shape: "box", nodeInfo: aven},
        {id: bitty.getID(), label: "Bitty", shape: "box", nodeInfo: bitty},
        {id: joya.getID(), label: "Joya", shape: "box", nodeInfo: joya}
    ])
    const [edges, setEdges] = useState([
        {id: 1, from: jayden.getID(), to: ryan.getID(), label: "Uncle"},
        {id: 2, from: ryan.getID(), to: amanda.getID(), label: "Wife"},
        {id: 3, from: jayden.getID(), to: steffanie.getID(), label: "Mother"},
        {id: 4, from: jayden.getID(), to: aaron.getID(), label: "Friend"},
        {id: 5, from: jayden.getID(), to: malachi.getID(), label: "Friend"},
        {id: 6, from: jayden.getID(), to: zach.getID(), label: "Friend"},
        {id: 7, from: amanda.getID(), to: aven.getID(), label: "Child"},
        {id: 8, from: amanda.getID(), to: bitty.getID(), label: "Child"},
        {id: 9, from: steffanie.getID(), to: joya.getID(), label: "Friend"}
    ])

    const [isCtrlPressed, setIsCtrlPressed] = useState(false);
    const [rightClickedNode, setRightClickedNode] = useState(null);
    const [rightClickedEdge, setRightClickedEdge] = useState(null);
    const [selectedNodeType, setSelectedNodeType] = useState(null);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [dynamicOptions, setDynamicOptions] = useState(options);
    const isCtrlPressedRef = useRef(false);

    function resetRightClickedNode() {
      setRightClickedNode(null);
    }
  
    function resetRightClickedEdge() {
      setRightClickedEdge(null);
    }

    let [state, setState] = useState({
      graph: {nodes: nodes, edges: edges},
      events: {
          selectNode: (event) => {
            const nodeId = event.nodes[0]; 
            if (nodeId) {
              handleNodeClick(nodeId);
            }
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
              // If the Ctrl key is pressed, toggle the selection of the node
              if (isCtrlPressedRef) {
                if (selectedNodes.includes(nodeID)) {
                  setSelectedNodes(prev => prev.filter(id => id !== nodeID)); // Deselect
                } else {
                  setSelectedNodes(prev => [...prev, nodeID]); // Select
                }
              } else {
                // If no modifier key, clear selection and select the current node
                setSelectedNodes([nodeID]);
              }
              
              setRightClickedNode(nodeID);
              const currentNodeType = nodes.find(x => x.id === nodeID).nodeInfo;
              
              if (currentNodeType !== undefined) {
                if (currentNodeType instanceof Person) {
                  setSelectedNodeType('person');
                } else {
                  setSelectedNodeType('organization');
                }
              }
              resetEdgeContextMenu();
              resetCanvasContextMenu();
              handleNodeOnContextMenu(event);
            } else if (edgeID !== undefined) {
              setRightClickedEdge(edgeID);
              resetNodeContextMenu();
              resetCanvasContextMenu();
              handleEdgeOnContextMenu(event);
            } else {
              resetNodeContextMenu();
              resetEdgeContextMenu();
              handleCanvasOnContextMenu(event);
            }
          }
        },
        network: null
    })

    // methods
    const addPerson = (name, phone, status, request, reminder, customFields) => {
      if (name !== '' && status !== '')
      {
        name = adjustDuplicateName(name);
        let nodeShape = "box"
        if (status === 'believer')
        {
            nodeShape = "circle"
        }
        const newPerson = new Person(name, phone, status, request, reminder, customFields)
        const personEntry = {id: newPerson.getID(), label: name, shape: nodeShape, nodeInfo: newPerson};
        const arrayCopy = [...nodes]; //creating a copy
        arrayCopy.push(personEntry);
        setNodes(arrayCopy);
      }
      else
      {
        ToastQueue.negative('Missing required fields.', {timeout:1500});
      }
    };

    const editPerson = (name, phone, status, request, reminder, customFields) => {
      if (name !== '' && status !== '') {
          const currentPerson = nodes.find(x => x.id === rightClickedNode).nodeInfo;
  
          if (currentPerson.getName() !== name) {
              name = adjustDuplicateName(name);
          }
  
          let nodeShape = "box";
          if (status === 'believer') {
              nodeShape = "circle";
          }
  
          // Update person info
          currentPerson.setName(name);
          currentPerson.setPhone(phone);
          currentPerson.setStatus(status);
          currentPerson.setRequest(request);
          currentPerson.setReminder(reminder);
  
          // Save custom fields
          currentPerson.setCustomFields(customFields); // Save the custom fields
  
          console.log(currentPerson.getName());
  
          const personEntry = {
              id: currentPerson.getID(),
              label: currentPerson.getName(),
              shape: nodeShape,
              nodeInfo: currentPerson
          };
  
          // Update nodes array
          const arrayCopy = [...nodes]; // creating a copy
          let nodeIndex = nodes.findIndex(obj => obj.id === rightClickedNode);
          arrayCopy[nodeIndex] = personEntry;
  
          setNodes(arrayCopy); // Update state with the modified node
          console.log(nodes);
      } else {
          ToastQueue.negative('Missing required fields.', { timeout: 1500 });
      }
  };
  
  

    const addOrganization = (name, description, website, request, reminder) => {
      if (name !== '')
      {
        name = adjustDuplicateName(name);
        const newOrg = new Organization(name, description, website, request, reminder)
        const orgEntry = {id: newOrg.getID(), label: name, shape: "box", nodeInfo: newOrg};
        const arrayCopy = [...nodes]; //creating a copy
        arrayCopy.push(orgEntry);
        setNodes(arrayCopy);
      }
      else
      {
        ToastQueue.negative('Missing required fields.', {timeout:1500});
      }
    }

    const handleNodeDelete = () => {
      if (selectedNodes.length > 0) {
        deleteNodes(selectedNodes);  // Pass the array of selected nodes for deletion
        setSelectedNodes([]);
      } else {
        deleteNode(rightClickedNode);  // Delete just the right-clicked node
      }
    };

    const deleteNodes = (nodeIDs) => {
      const updatedNodes = nodes.filter(node => !nodeIDs.includes(node.id));  // filter out the selected nodes
      const updatedEdges = edges.filter(edge => !nodeIDs.includes(edge.from) && !nodeIDs.includes(edge.to));  // filter related edges
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setState(prevState => ({
        ...prevState,
        graph: {
          nodes: updatedNodes,
          edges: updatedEdges
        }
      }));
      ToastQueue.positive(`${nodeIDs.length} Node(s) deleted successfully.`, {timeout: 1500});
    };

    const editOrganization = (name, description, website, request, reminder) => {
        if (name !== '')
        {
          const currentNode = nodes.find(x => x.id === rightClickedNode)
          const currentOrganization = currentNode.nodeInfo
          if (currentOrganization.getName() !== name)
          {
            name = adjustDuplicateName(name);
          }
          currentOrganization.setName(name)
          currentOrganization.setDescription(description)
          currentOrganization.setWebsite(website)
          currentOrganization.setRequest(request)
          currentOrganization.setReminder(reminder)
          console.log(currentOrganization.getName())
          const orgEntry = {id: currentOrganization.getID(), label: currentOrganization.getName(), shape: currentNode.shape, nodeInfo: currentOrganization};
          const arrayCopy = [...nodes]; //creating a copy
          let nodeIndex = nodes.findIndex(obj => obj.id === rightClickedNode)
          arrayCopy[nodeIndex] = orgEntry
          setNodes(arrayCopy);
          console.log(nodes)
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

      useEffect(() => {
        setState({
          graph: {nodes: nodes, edges: edges},
          events: {
            selectNode: (event) => {
              // Assuming event contains the nodeId that was clicked
              const nodeId = event.nodes[0]; // event.nodes is an array of clicked node IDs
              if (nodeId) {
                handleNodeClick(nodeId);  // Call the multi-selection handler
              }
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
                // If the Ctrl key is pressed, toggle the selection of the node
                if (isCtrlPressedRef) {
                  if (selectedNodes.includes(nodeID)) {
                    
                    setSelectedNodes(prev => prev.filter(id => id !== nodeID)); // Deselect
                  } else {
                    setSelectedNodes(prev => [...prev, nodeID]); // Select
                  }
                } else {
                  // If no modifier key, clear selection and select the current node
                  setSelectedNodes([nodeID]);
                }
                
                setRightClickedNode(nodeID);
                const currentNodeType = nodes.find(x => x.id === nodeID).nodeInfo;
                
                if (currentNodeType !== undefined) {
                  if (currentNodeType instanceof Person) {
                    setSelectedNodeType('person');
                  } else {
                    setSelectedNodeType('organization');
                  }
                }
                resetEdgeContextMenu();
                resetCanvasContextMenu();
                handleNodeOnContextMenu(event);
              } else if (edgeID !== undefined) {
                setRightClickedEdge(edgeID);
                resetNodeContextMenu();
                resetCanvasContextMenu();
                handleEdgeOnContextMenu(event);
              } else {
                resetNodeContextMenu();
                resetEdgeContextMenu();
                handleCanvasOnContextMenu(event);
              }
            }
          },
          network: state.network
        })
    
    }, [nodes,edges]);
  
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
            const newEdge = {id: uuidv4(), from: sourceID, to: targetID, label: label};
            const arrayCopy = [...edges];
            arrayCopy.push(newEdge);
            setEdges(arrayCopy);
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

    const editEdge = (targetID, label) => {
        const currentEdge = edges.find(x => x.id === rightClickedEdge)
        if (targetID !== null && label !== '')
        {
            for (let i = 0; i<edges.length; i++)
            {
                if (edges[i].from === currentEdge.from && edges[i].to === targetID)
                {
                    const source = nodes.find(x => x.id === currentEdge.from)
                    ToastQueue.info('Edge from ' + source.label + 
                    ' to ' + nodes.find(x => x.id === targetID).label + ' already exists.', {timeout:1500})
                    return;
                }
            }
            // updates the edges array
            const sameEdge = {id: currentEdge.id, from: currentEdge.from, to: targetID, label: label};
            const arrayCopy = [...edges];
            let edgeIndex = arrayCopy.findIndex(obj => obj.id === rightClickedEdge)
            arrayCopy[edgeIndex] = sameEdge
            setEdges(arrayCopy);
            console.log(edges)
            ToastQueue.positive('Successfully updated link.', {timeout:1500});
        }
        else
        {
            ToastQueue.negative('Missing required fields.', {timeout:1500});
        }
    }

    const setNetworkInstance = nw => {
      state.network = nw;
      setupEventListeners(nw);
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

    const [editNodeDialog, setEditNodeDialog] = useState(false);

    function closeEditNodeDialog() {
      setEditNodeDialog(false);
    }

    const [orgDialog, setOrgDialog] = useState(false);

    function closeOrgDialog() {
      setOrgDialog(false);
    }

    const [linkDialog, setLinkDialog] = useState(false);

    function closeLinkDialog() {
      setLinkDialog(false);
      console.log("link dialog closed.")
    }

    const [propertiesDialog, setPropertiesDialog] = useState(false);

    function closePropertiesDialog(){
      setPropertiesDialog(false);
      console.log("properties dialog closed.")
    }

    const updateColor = (node, color) =>{
      node.color = color;
      const newNode = {id: node.id, label: node.label, shape: node.shape, color: node.color, nodeInfo: node.nodeInfo}
      console.log(state.graph.nodes);
      return newNode
    }

    const updateShape = (node, shape) => {
      node.shape = shape;
      const newNode = {id: node.id, label: node.label, shape: node.shape, color: node.color, nodeInfo: node.nodeInfo};
      return newNode
    }

    const updateColorAndShape = (color, shape) => {
      const arrayCopy = [...nodes]; //creating a copy
      let nodeIndex = nodes.findIndex(obj => obj.id === rightClickedNode)
      let overwriteNode = arrayCopy[nodeIndex];
      overwriteNode = updateColor(overwriteNode, color)
      if (shape === null){
        shape = overwriteNode.shape
      }
      overwriteNode = updateShape(overwriteNode, shape)
      const newNode = {id: overwriteNode.id, label: overwriteNode.label, shape: overwriteNode.shape, color: overwriteNode.color, nodeInfo: overwriteNode.nodeInfo}
      arrayCopy[nodeIndex] = newNode
      setNodes(arrayCopy);
    }

    const [editLinkDialog, setEditLinkDialog] = useState(false);

    function closeEditLinkDialog() {
      setEditLinkDialog(false);
    }


  const handleKeyDown = (event) => {
    if (event.key === 'Control' || event.key === 'Meta') { 
      isCtrlPressedRef.current = true;
      setIsCtrlPressed(true); 
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Control' || event.key === 'Meta') {
      isCtrlPressedRef.current = false;  // Update ref
      setIsCtrlPressed(false);
    }
  };

  const handleCanvasClick = (event) => {
    setSelectedNodes([]);  // Deselect all nodes on background click
  };

  const setupEventListeners = (network) => {
    network.on('click', (event) => {
      if (!event.nodes.length) {
        handleCanvasClick(event);
      }
    });
  };
  
  // only grabs the entity nodes (Person/Org)
  const entitySelection = selectedNodes.filter(nodeId => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.nodeInfo) {
      return node.nodeInfo instanceof Person || node.nodeInfo instanceof Organization;
    }
    // Return false if no valid nodeInfo found
    return false;
  });

  

  // Update the dynamic options based on Ctrl press state
  useEffect(() => {
    setDynamicOptions((prevOptions) => ({
      ...prevOptions,
      interaction: {
        ...prevOptions.interaction,
        zoomView: isCtrlPressed,  // Enable zoom when Ctrl is pressed
      },
    }));
  }, [isCtrlPressed]);

  // Set up event listeners for key press events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (state.network && selectedNodes.length > 0) {
      state.network.selectNodes(selectedNodes);  
    } else if (state.network) {
      state.network.unselectAll();  
    }
  }, [selectedNodes, state.network]); 

  // working on finding a way for deselect but i think out of scope - separate task
  const handleNodeClick = (nodeId) => {
    const isCtrlHeldDown = isCtrlPressedRef.current; 
    console.log('Ctrl pressed:', isCtrlHeldDown);
    console.log('Node clicked:', nodeId);

    if (isCtrlHeldDown) {
      setSelectedNodes((prevSelectedNodes) => {
        if (prevSelectedNodes.includes(nodeId)) { 
          return prevSelectedNodes.filter((id) => id !== nodeId);
        } else {
          return [...prevSelectedNodes, nodeId];
          
        }
      });
    } else {
      setSelectedNodes((prevSelectedNodes) => {
        if (prevSelectedNodes.includes(nodeId)) {
          return prevSelectedNodes.filter((id) => id !== nodeId);
        } else {
          return [nodeId];
        }
      });
    }
  };


    return (
        <AppContext.Provider value = {{state, nodes, edges, personDialog, editNodeDialog,
                                      orgDialog, rightClickedNode, rightClickedEdge, propertiesDialog, 
                                      linkDialog, editLinkDialog, selectedNodeType, selectedNodes, addPerson, editPerson, addOrganization, 
                                      editOrganization, addEdge, editEdge, closePersonDialog, closeEditNodeDialog, 
                                      closeOrgDialog, resetRightClickedNode, resetRightClickedEdge,
                                      closePropertiesDialog, updateColorAndShape, deleteNode, deleteEdge,
                                      closeLinkDialog, closeEditLinkDialog}}>
            {children}
            <div className='container'
            onContextMenu={(e) => {
              e.preventDefault(); // prevent the default behaviour when right clicked
            }}>
            <div className="button-container">
              <button class='addPerson' onClick={() => {
                  setPersonDialog(true);      // Open the "Add Person" dialog
                  resetCanvasContextMenu();   // Reset the canvas context menu
                  }}>
                  
                Add Person
              </button>
              <button class='addOrg' onClick={() => {
                  setOrgDialog(true);      // Open the "Add Person" dialog
                  resetCanvasContextMenu();   // Reset the canvas context menu
                  }}> 
                Add Organization
              </button>
            </div>
              <Graph
                  graph={state.graph}
                  options={dynamicOptions}
                  events={state.events}
                  getNetwork={setNetworkInstance}
              />
              <NodeContextMenu 
                contextMenuRef={contextMenuRef}
                isToggled={nodeContextMenu.toggled}
                positionX={points.x}
                positionY={points.y}
                buttons={
                  entitySelection.length > 2
                    ? [ // Show only "Delete Selected Nodes" if more than one node is selected
                        {
                          text: "Delete Selected Nodes",
                          icon: "",
                          onClick: () => { handleNodeDelete(); resetNodeContextMenu() },
                        }
                      ]
                    : [ // Show full set of buttons if one or no node is selected
                        {
                          text: "Add Link",
                          icon: "➕",
                          onClick: () => { setLinkDialog(true); resetNodeContextMenu() },
                        },
                        {
                          text: entitySelection > 1 ? "Edit Selected Nodes" : "Edit Info",
                          icon: "",
                          onClick: () => { setEditNodeDialog(true); resetNodeContextMenu() },
                        },
                        {
                          text: "Properties",
                          icon:"",
                          onClick: () => { setPropertiesDialog(true); resetNodeContextMenu() },
                        },
                        {
                          text: entitySelection > 1 ? "Delete Selected Nodes" : "Delete Node",
                          icon: "",
                          onClick: () => { handleNodeDelete(); resetNodeContextMenu() },
                        }
                      ]
                }
              />
              <EdgeContextMenu
                contextMenuRef={contextMenuRef}
                isToggled={edgeContextMenu.toggled}
                positionX={points.x}
                positionY={points.y}
                buttons={[
                  {
                    text: "Edit",
                    icon: "",
                    onClick: () => {setEditLinkDialog(true); resetEdgeContextMenu()},
                  },
                  {
                    text: "Delete Edge",
                    icon: "",
                    onClick: () => {deleteEdge(rightClickedEdge); resetEdgeContextMenu()},
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
                  },
                ]}
              />
            </div>
        </AppContext.Provider>
    )
}