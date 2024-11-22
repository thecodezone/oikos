import {addNode, deleteNode, updateNode} from "./apiFunctions.js"
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
    const nodeID = req.body.nodeID;
    const data = req.body.data;
    const tableName = process.env.TABLE_NAME;
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

export default app;
