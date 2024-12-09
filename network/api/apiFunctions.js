import clientDynamoDB from "@aws-sdk/client-dynamodb";
import clientDynamoLib from "@aws-sdk/lib-dynamodb";

const client = new clientDynamoDB.DynamoDBClient({});
const docClient = clientDynamoLib.DynamoDBDocumentClient.from(client);

export async function addNode(partition, nodeID, data, tableName) {
    console.log(`addNode ${partition}, ${nodeID}, ${data}, ${tableName}`);

    const putCommand = new clientDynamoLib.PutCommand({
        TableName: tableName,
        Item: {
            Partition: partition,
            NodeID: nodeID,
            Name: data.name,
            Phone: data.phone, 
            Status: data.status, 
            Request: data.request, 
            Reminder: data.reminder, 
            CustomFields: data.customFields,
            Position: {X: 0, Y: 0}
        },
    });
    try {
        await docClient.send(putCommand);
        console.log("Node added");
        const result = {
            "status": 100,
            "nodeID": nodeID
        }
        return result;
    } catch (err) {
        console.log(err);
        const result = {
            "status": 900,
            "nodeID": nodeID
        }
        return result;
    }
};

export async function deleteNode(partition, nodeID, tableName) {
    console.log(`deleteNode ${partition}, ${nodeID}, ${tableName}`);

    const deleteCommand = new clientDynamoLib.DeleteCommand({
        TableName: tableName,
        Key: {
            Partition: `${partition}`,
            NodeID: `${nodeID}`
        },
    });
    try {
        await docClient.send(deleteCommand);
        console.log("Node deleted");
        const result = {
            "status": 100,
            "Partition": partition,
            "NodeID": nodeID,
        }
        return result;

    } catch (err) {
        console.log(err);
        const result = {
            "status": 900,
            "Partition": partition,
            "NodeID": nodeID,
        }
        return result;
    }
}

export async function updateNode(partition, nodeID, data, tableName) {
    console.log(`updateNode ${partition}, ${nodeID}, ${data}, ${tableName}`);
    const updateExpression = "SET Key = :expressionValue";
    const expressionAttributeValues = {
    ":expressionValue": data, // data will be expanded to more keys and values later
    };

    const updateCommand = new clientDynamoLib.UpdateCommand({
        TableName: tableName,
        Key: {
            Partition: partition,
            NodeID: nodeID
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
    });

    try {
        await docClient.send(updateCommand);
        console.log("Node updated");
        const result = {
            "status": 100,
            "NodeID": nodeID,
        }
        return result;

    } catch (err) {
        console.log(err);
        const result = {
            "status": 900,
            "NodeID": nodeID,
        }
        return result;
    }
}

export async function getAllDataFromTable(tableName) {
    console.log(`getAllDataFromTable ${tableName}`);

    const selectItemStatementCommand = new clientDynamoLib.ExecuteStatementCommand({
        Statement: `SELECT * FROM ` + `"` + tableName + `"`
    });
    try {
        const selectItemResponse = await docClient.send(selectItemStatementCommand);
        console.log("Data gotten");
        const result = {
            "status": 100,
            "Nodes": selectItemResponse.Items
        }
        return result;
    } catch (err) {
        console.log(err);
        const result = {
            "status": 900
        }
        return result;
    }
};

export async function updateNodePos(partition, nodeID, newX, newY, tableName) {
    console.log(`\nupdateNodePos ${partition}, ${nodeID}, ${newX}, ${newY}, ${tableName}`);
    const updateExpression = "SET #position.#x = :newX, #position.#y = :newY";
    const expressionAttributeNames = {
        "#position": "Position",
        "#x": "X",
        "#y": "Y",
    };
    const expressionAttributeValues = {
        ":newX": newX,
        ":newY": newY,
    };

    const updateCommand = new clientDynamoLib.UpdateCommand({
        TableName: tableName,
        Key: {
            Partition: partition,
            NodeID: nodeID
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
    });

    try {
        const response = await docClient.send(updateCommand);
        console.log(`Node position updated successfully. Status: `, response.$metadata.httpStatusCode);
        const result = {
            "status": 100,
            "NodeID": nodeID,
            "Position.X": newX,
            "Position.Y": newY
        }
        return result;

    } catch (err) {
        console.error("Error updating node position:", err);
        const result = {
            "status": 900,
            "NodeID": nodeID,
            "Position.X": newX,
            "Position.Y": newY
        }
        return result;
    }
}