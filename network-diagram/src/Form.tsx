import { useRef } from "react";
import {Button, TextField, defaultTheme, Provider} from '@adobe/react-spectrum';
import Collapsible from "react-collapsible";


export default function Uncontrolled() {
  const selectRef = useRef(null);
  const checkboxRef = useRef(null);
  const inputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Input value:", inputRef.current.value);
    console.log("Select value:", selectRef.current.value);
    console.log("Checkbox value:", checkboxRef.current.checked);
  }

  return (
    <Collapsible trigger="Pray for Someone">
    <form onSubmit={handleSubmit}>
      <Provider theme={defaultTheme}>
      <label>
      <p>Add subject to map:</p>
        <TextField label="Subject Name" labelPosition="side" width="size-3000" />
      </label>
      <label>
      <p></p>
        <TextField label="Location" labelPosition="side" width="size-3000" />
      </label>
      <label>
        <p>Subject Status:</p>
        <select ref={selectRef}>
          <option value="red">Believer</option>
          <option value="green">Non-Believer</option>
        </select>
      </label>
      <label>
        <p>Prayer Requests:</p>
        <textarea name="content" rows={4} cols={40} />
      </label>
      <label>
        <p>Add Prayer Reminder?</p>
        <input type="checkbox" ref={checkboxRef} />
      </label>
        <Button variant="accent" onPress={() => alert(document.getElementById("username") + 'Successfully added to map')}>Add to map</Button>
      </Provider>
    </form>
    </Collapsible>
  );
}