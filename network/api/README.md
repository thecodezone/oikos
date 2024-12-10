# Database Documentation
### Table of contents
* [DynamoDB Nodes Table Schema](#dynamodb-nodes-table-schema)
* [JSON Data Schemas](#json-data-schemas)
    * [Person Nodes](#person-nodes)
        * [clickedNode JSON example](#person-clickednode-json-example)
        * [nodeInfoJson JSON example](#person-nodeinfojson-json-example)
    * [Organization Nodes](#organization-nodes)
        * [clickedNode JSON example](#organization-clickednode-json-example)
        * [nodeInfoJson JSON example](#organization-nodeinfojson-json-example)

<br>

## DynamoDB Nodes Table Schema 
|     | <span class="green">Partition Key</span> | <span class="green">Sort Key</span> | <span class="light-blue">Rest of Data</span> | <span class="light-blue">"</span> | <span class="light-blue">"</span> | <span class="light-blue">"</span> | <span class="light-blue">"</span> | <span class="light-blue">"</span> | <span class="light-blue">"</span> | <span class="light-blue">"</span> | <span class="light-blue">"</span> | <span class="light-blue">"</span> |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| <span class="light-blue">**Column Names**</span> | <span class="string-red">Partition</span> | <span class="string-red">NodeID</span> | <span class="string-red">Type</span> | <span class="string-red">Shape</span> | <span class="string-red">Name</span> | <span class="string-red">Phone</span> | <span class="string-red">Reminder</span> | <span class="string-red">Request</span> | <span class="string-red">Status</span> | <span class="string-red">customFields</span> | <span class="string-red">Website</span> | <span class="string-red">Description</span> |
| <span class="light-blue">**Dummy Data**</span> | Development | 1a7e2bf7-644c-4d32-849e-62097716b0b7 | Person | box | Blank | 123-456-7890 | false | This is my prayer request | seeker | [{name: "Key1", value: "Value1"}, {name: "Testimony", value: "Value"}] | <span class="blue">None</span> | <span class="blue">None</span> |
| <span class="light-blue">**Dummy Data**</span> | Development | a8d8f715-63e0-4bdc-b460-9739c80a744c | Person | circle | Dummy | 098-765-4321 | true | I need prayer | believer | [{name: "Favorite Food", value: "Pizza"}, {name: "Age/Birthday", value: "08/05/2003"}] | <span class="blue">None</span> | <span class="blue">None</span> |
| <span class="light-blue">**Dummy Data**</span> | Development | 5111f547-9a51-4c49-95fc-1fee78ddc416 | Organization | box | Some Org | <span class="blue">None</span> | false | Pray for this | <span class="blue">None</span> | [{Key: "Value"}, {Key2: "Value2"}] | URL.com | Some description |

<fieldset>
<legend>Table Legend</legend>

* <span class="green">GREEN</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -- Required Column 
* <span class="light-blue">LIGHT BLUE</span> &nbsp;&nbsp;&nbsp;&nbsp; -- Column/Row Identifier 
* <span class="string-red">RED</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -- Column Name In DynamoDB 
* <span class="blue">BLUE</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -- Empty Data Field 
* WHITE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -- Data Example 

</fieldset>

## JSON Data Schemas
<fieldset>

### Person Nodes

<fieldset>
    <legend>Code example</legend>
    <span class="blue">const</span><span class="light-blue"> clickedNode</span> = </span><span class="blue">nodes</span>.</span><span class="yellow">find</span><span class="blue">(</span><span class="light-blue"> x</span>.</span><span class="light-blue">id</span> === </span><span class="light-blue">nodeId</span><span class="blue">)</span>;
</fieldset>

### Person: clickedNode JSON example
```json
Object {
    id: {S: "1a7e2bf7-644c-4d32-849e-62097716b0b7"} // Repeated Value
    label: {S: "Blank"}                         // Repeated Value
    nodeInfo: {M: Person {object...}}
    shape: {S: "box"}
}
```

<fieldset>
    <legend>Code example</legend>
    <span class="blue">const</span><span class="light-blue"> nodeInfoJson</span> = <span class="blue">clickedNode</span>.<span class="light-blue">nodeInfo</span>;
</fieldset>

### Person: nodeInfoJson JSON example
```json
{
    customFields: {L: [
            {M: {Key: "Value"}}, 
            {M: {Key2: "Value2"}}
        ]}
    id: {S: "1a7e2bf7-644c-4d32-849e-62097716b0b7"}
    name: {S: "Blank"} // Same value as 'label' key
    phone: {S: ""}
    reminder: {BOOL: false}
    request: {S: ""}
    status: {S: "seeker"}
}
```
</fieldset>

<br>

<fieldset>

### Organization Nodes
<fieldset>
    <legend>Code example</legend>
    <span class="blue">const</span><span class="light-blue"> clickedNode</span> = </span><span class="blue">nodes</span>.</span><span class="yellow">find</span><span class="blue">(</span><span class="light-blue"> x</span>.</span><span class="light-blue">id</span> === </span><span class="light-blue">nodeId</span><span class="blue">)</span>;
</fieldset>

### Organization: clickedNode JSON example
```json
Object {
    id: {S: "5111f547-9a51-4c49-95fc-1fee78ddc416"} // Repeated Value
    label: {S: "Some Org"}                          // Repeated Value
    nodeInfo: {M: Organization {object...}}
    shape: {S: "box"}
}
```
<fieldset>
    <legend><span class="blue">Code example</span></legend>
    <span class="blue">const</span><span class="light-blue"> nodeInfoJson</span> = <span class="blue">clickedNode</span>.<span class="light-blue">nodeInfo</span>;
</fieldset>

### Organization: nodeInfoJson JSON example
```json
{
    customFields: {L: [
            {M: {Key: "Value"}}, 
            {M: {Key2: "Value2"}}
        ]}
    description: {S: "Some description"}
    id: {S: "5111f547-9a51-4c49-95fc-1fee78ddc416"}
    name: {S: "Some Org"} // Same value as 'label' key
    reminder: {BOOL: false}
    request: {S: ""}
    website: {S: "Some URL"} // has validation for url type required
}
```

</fieldset>


<style>
    .string-red {
        color: #E05C4A;
    }

    .light-blue {
        color: lightblue;
    }

    .blue {
        color: #5A9BD5;
    }

    .green {
        color: green;
    }

    .yellow {
        color: wheat;
    }
</style>

