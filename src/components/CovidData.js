import React, { useState } from "react";
import CovidDistrict from "./CovidDistrict";
import axios from "axios";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default class CovidData extends React.Component {
  state = {
    State: "",
    StateData: [],
    RequiredStateId: null,
  };
  //   const [state, setState] = useState("");
  //   const [stateData, setStateData] = useState([]);
  //   const [stateId, setStateId] = useState("");

  componentDidMount() {
    axios
      .get(`https://cdn-api.co-vin.in/api/v2/admin/location/states`)
      .then((response) => {
        const res = response.data;
        //console.log(res.states);
        this.setState({ StateData: res.states });
      });
  }

  handleChangeState = (event) => {
    this.setState({ State: event.target.value }, () => {
      const stateid = this.state.StateData.filter(
        (item) => item.state_name === this.state.State
      );
      console.log(stateid);
      this.setState({ RequiredStateId: stateid[0].state_id });
    });
  };

  render() {
    console.log(this.state.RequiredStateId);
    return (
      <>
        <TextField
          select
          label="Select State"
          variant="outlined"
          value={this.state.State}
          onChange={this.handleChangeState}
        >
          {this.state.StateData.map((option) => (
            <MenuItem key={option.state_id} value={option.state_name}>
              {option.state_name}
            </MenuItem>
          ))}
        </TextField>
        {this.state.RequiredStateId != null ? (
          <CovidDistrict data={this.state.RequiredStateId} />
        ) : null}
      </>
    );
  }
}
