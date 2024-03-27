import React, { useState } from 'react';
import Graph from 'react-vis-network-graph';
import IndividualPrayerForm from '../AddPersonForm.tsx';
import OrgPrayerForm from '../AddOrgForm.tsx';
import { options } from './options';


let nextNodeId = 11
let nextEdgeId = 1

export const addPerson = (event, name, nextNodeId, nodes, setNodes) => {
    console.log("addPerson");
    console.log(name);
    console.log(nextNodeId);
    console.log(event);
    const newPerson = {id: nextNodeId++, label: name, shape: "box"};
    console.log(newPerson);
    //const arrayCopy = [...nodes]; //creating a copy
    //arrayCopy.push(newPerson);
    //setNodes(arrayCopy);
};

export default function PrayerMap() {
    const [name, setName] = useState('');
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
        {id: "e" + nextEdgeId++, from: 1, to: 2},
        {id: "e" + nextEdgeId++, from: 2, to: 3},
        {id: "e" + nextEdgeId++, from: 1, to: 4},
        {id: "e" + nextEdgeId++, from: 1, to: 5},
        {id: "e" + nextEdgeId++, from: 1, to: 6},
        {id: "e" + nextEdgeId++, from: 1, to: 7},
        {id: "e" + nextEdgeId++, from: 3, to: 8},
        {id: "e" + nextEdgeId++, from: 3, to: 9},
        {id: "e" + nextEdgeId++, from: 4, to: 10}
    ])
    //const addPerson = () => {
    //    const newPerson = {id: nextNodeId++, label: name, shape: "box"};
    //    const arrayCopy = [...nodes]; //creating a copy
    //    arrayCopy.push(newPerson);
    //    setNodes(arrayCopy);
    //};
    var data = {nodes: nodes, edges: edges}
    return (
        <>
        <IndividualPrayerForm />
        <OrgPrayerForm />
      
import { AppData } from './AppWrapper';

export default function GraphView() {
    const [name, setName] = useState('');
    const { nodes, edges, addPerson } = AppData();
    var data = {nodes: nodes, edges: edges}
    return (
        <>
        <input
        value={name}
        onChange={e => setName(e.target.value)}
        />
        <button className="addPersonButton" onClick={() => addPerson(name)}>
            Add Person
        </button>

        <div className='container'>
            <Graph
                graph = {data}
                options = {options}
            />
        </div>
        </>
    )
}