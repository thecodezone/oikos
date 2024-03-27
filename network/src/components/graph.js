import React, { useState } from 'react';
import Graph from 'react-vis-network-graph';
import { options } from './options';
import { AppData } from './AppWrapper';

export default function GraphView() {
    const { nodes, edges, addEdge } = AppData();
    var data = {nodes: nodes, edges: edges}
    return (
        <>
        <button className="addEdgeButton">
            add Link
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