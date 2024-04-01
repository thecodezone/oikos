import { createContext, useContext, useState } from "react";

const AppContext = createContext()
export const AppData = () => useContext(AppContext)

export const AppWrapper = ({children}) => {
    const [nodes, setNodes] = useState([
        {id: 1, label: "Jayden", shape: "circle", name: "Jayden"},
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
        {from: 1, to: 2},
        {from: 2, to: 3},
        {from: 1, to: 4},
        {from: 1, to: 5},
        {from: 1, to: 6},
        {from: 1, to: 7},
        {from: 3, to: 8},
        {from: 3, to: 9},
        {from: 4, to: 10}
    ])

    const addPerson = (name) => {
        var id = nodes.length + 1
        const newPerson = {id: id, label: name, shape: "box"};
        const arrayCopy = [...nodes]; //creating a copy
        arrayCopy.push(newPerson);
        setNodes(arrayCopy);
    };

    const addEdge = (sourceID, targetID) => {
        const newEdge = {from: sourceID, to: targetID};
        console.log(sourceID)
        console.log(targetID)
        console.log("edges before: ")
        console.log(edges)
        const arrayCopy = [...edges];
        arrayCopy.push(newEdge);
        console.log("copy of array after pushing")
        console.log(arrayCopy)
        setEdges(arrayCopy);
        console.log("edges after: ");
        console.log(edges)
    }

    return (
        <AppContext.Provider value = {{nodes, edges, addPerson, addEdge}}>
            {children}
        </AppContext.Provider>
    )
}