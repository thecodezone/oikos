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
            Data: data, // data will be expanded to more keys and values later
        },
    });
    try {
        await docClient.send(putCommand);
        console.log("Node added");
        const result = {
            "status": 100,
            "expID": nodeID
        }
        return result;
    } catch (err) {
        console.log(err);
        const result = {
            "status": 900,
            "expID": nodeID
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