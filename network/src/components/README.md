# Making Methods/Variables Available across other files
1. Place the method or variable that you would like other files to access in AppWrapper
2. In the AppContext.Provider of the return, provide the method name to the value parameter

NOTE - for all `const [method, setMethod]`s, create an alternate method for using the setter outside of the file. Do not pass the `setMethod` in the AppContext.Provider as it may not update or could cause an error.
## To Access the Method in another File
1. import AppData from AppWrapper
2. Call for the method or variable by name
- ex. `const { variable, method } = AppData();`
3. The variable or method can now be called in that file using the variable name or method name
# Adding Right-Click Options
1. There are three areas so far for right click menus: nodes, edges, canvas
2. In AppWrapper.js, towards the bottom of the return of AppWrapper, there is context menus (nodeContext, edgeContext, canvasContext)
3. Add a button using the following format

`{
    text: "Button name",
    icon: "",
    onClick: () => {methodCalledName(); resetContextMenuMethod()},
}`

4. If adding the button to a node, put it in the nodeContextMenu, if adding to an edge, edgeContextMenu, etc.
## If the Method is opening a popup dialog in another file
1. Have the dialog pop up be dependent on a boolean (to open) located in the app wrapper (see Making Methods/Variables available across other files)
2. In the `methodCalledName();` of the onClick of the button, set the boolean to true (which opens the pop up)
3. Upon closing set the boolean in the AppWrapper to false

NOTE - if using a `const [method, setMethod]` use a custom method to pass to the other file to `setMethod` calling the setter straight from AppWrapper may not update or could cause an error.
