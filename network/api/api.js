import {addNode, deleteNode, updateNode, getAllDataFromTable, updateNodePos} from "./apiFunctions.js"
import { Router } from "express";
import dotenv from "dotenv";

dotenv.config()

const app = Router();

// Sample endpoints
app.get('/testRoutes', (req, res) => {
    // ".../api/testRoutes" to test directly in browser
    res.json({ message: 'Hello from the API routes!' });
});

app.post('/addNode', (req, res) => {
    // TODO: Add schema validation
    const partition = "Development" // TODO: Later will be implemented as a user
    const nodeID = req.body.id;
    console.log(req.body);
    const data = req.body.nodeInfo;
    console.log(JSON.stringify("data is " + JSON.stringify(data)));
    const tableName = process.env.PERSONS_TABLE_NAME;
    console.log(`:api-route /addNode ${partition}, ${nodeID}, ${data}, ${tableName}`)
    addNode(partition, nodeID, data, tableName).then(function (returnVal) {
        console.log(":api-route /Returned " + returnVal);
        res.json(returnVal);
    });
});

app.post("/deleteNode", async function (req, res) {
    // TODO: Add schema validation
    const partition = "Development" // TODO: Later will be implemented as a user
    const nodeID = req.body.nodeID;
    const tableName = process.env.TABLE_NAME;
    console.log(`:api-route /deleteNode ${partition}, ${nodeID}`)
    deleteNode(partition, nodeID, tableName).then(async function (returnVal) {
        console.log(":api-route /Returned " + returnVal);
        res.json(returnVal);
    });
});

app.post('/updateNode', (req, res) => {
    // TODO: Add schema validation
    const partition = "Development" // TODO: Later will be implemented as a user
    const nodeID = req.body.nodeID;
    const data = req.body.data;
    const tableName = process.env.PERSONS_TABLE_NAME;
    console.log(`:api-route /updateNode ${partition}, ${nodeID}, ${data}, ${tableName}`)
    updateNode(partition, nodeID, data, tableName).then(function (returnVal) {
        console.log(":api-route /Returned " + returnVal);
        res.json(returnVal);
    });
});

app.get("/getAllNodes", async function (req, res) {
    console.log(`:api-route /getAllNodes`)
    getAllDataFromTable(process.env.PERSONS_TABLE_NAME).then(function (returnVal) {
        console.log(":api-route /getAllNodes Returned " + returnVal);
        res.json(returnVal);
    });
});

app.get("/getAllEdges", async function (req, res) {
    console.log(`:api-route /getAllEdges`)
    getAllDataFromTable(process.env.EDGES_TABLE_NAME).then(function (returnVal) {
        console.log(":api-route /getAllEdges Returned " + returnVal);
        res.json(returnVal);
    });
});

app.post('/updateNodePos', (req, res) => {
    // TODO: Add schema validation
    const partition = "Development"
    const nodeID = req.body.nodeID;
    const newX = req.body.newX;
    const newY = req.body.newY;
    const tableName = process.env.PERSONS_TABLE_NAME;
    console.log(`:api-route /updateNodePos ${partition}, ${nodeID}, ${newX}, ${newY}, ${tableName}`)
    updateNodePos(partition, nodeID, newX, newY, tableName).then(function (returnVal) {
        console.log(":api-route /Returned " + returnVal);
        res.json(returnVal);
    });
});

export default app;
