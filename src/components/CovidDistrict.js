import React, { useState } from "react";
import axios from "axios";
import CovidVaccineSlots from "./CovidVaccineSlots";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default class CovidDistrict extends React.Component {
  state = {
    propid: this.props.data,
    City: "",
    DistrictData: [],
    VaccineLocation: [],
    RequiredDistrictId: null,
    date: null,
  };
  //   const [state, setState] = useState("");
  //   const [stateData, setStateData] = useState([]);
  //   const [stateId, setStateId] = useState("");

  getDistrictId() {
    axios
      .get(
        `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${this.state.propid}`
      )
      .then((response) => {
        const res = response.data;
        //console.log(res.states);
        this.setState({ propid: null });
        this.setState({ DistrictData: res.districts });
        console.log(res);
      });
  }

  handleChangeState = (event) => {
    this.setState({ City: event.target.value }, () => {
      const districtid = this.state.DistrictData.filter(
        (item) => item.district_name === this.state.City
      );
      console.log(districtid);
      this.setState({ RequiredDistrictId: districtid[0].district_id }, () => {
        axios
          .get(
            `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${this.state.RequiredDistrictId}&date=${this.state.date}`
          )
          .then((response) => {
            const res = response.data;
            console.log(res);
            this.setState({ VaccineLocation: res.sessions });
            console.log(this.state.VaccineLocation);
          });
      });
    });
  };

  componentDidMount() {
    const dateObj = new Date();
    const month = dateObj.getMonth() + 1;
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const output = day + "-" + month + "-" + year;
    this.setState({
      date: output,
    });
  }

  render() {
    // console.log(output);
    if (this.state.propid != null) {
      this.getDistrictId();
    }
    return (
      <>
        <TextField
          select
          label="Select city"
          variant="outlined"
          value={this.state.City}
          onChange={this.handleChangeState}
        >
          {this.state.DistrictData.map((option) => (
            <MenuItem key={option.district_id} value={option.district_name}>
              {option.district_name}
            </MenuItem>
          ))}
        </TextField>
        <div>
          {this.state.VaccineLocation.map((item) => {
            return (
              <li
                style={{
                  paddingLeft: "4rem",
                  paddingBottom: "5rem",
                  textAlign: "left",
                }}
              >
                <span>CenterID : {item.center_id}</span>
                <br />
                <span>Name of vaccination center : {item.name}</span>
                <br />
                <span>Address : {item.address}</span>
                <br />
                <span>District Name: {item.district_name}</span>
                <br />
                <span>Slots : {item.slots}</span>
                <br />
              </li>
            );
          })}
        </div>
      </>
    );
  }
}
