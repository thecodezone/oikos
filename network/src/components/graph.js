import React, { useState } from 'react';
import Graph from 'react-vis-network-graph';
import { options } from './options';
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