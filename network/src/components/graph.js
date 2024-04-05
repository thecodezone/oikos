import React, { useState } from 'react';
import Graph from 'react-vis-network-graph';
import { options } from './options';
import { AppData } from './AppWrapper';

export default function GraphView() {
    const { state } = AppData();
    const { graph, events } = state; 
    return (
        <>
        <div className='container'>
            <Graph
                graph = {graph}
                options = {options}
                events = {events}
            />
        </div>
        </>
    )
}