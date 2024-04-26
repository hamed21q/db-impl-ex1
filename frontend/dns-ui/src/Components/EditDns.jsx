import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import {Autocomplete} from "@mui/material";

const EditDns = ({ open, onClose, id }) => {
  const [ip, setIp] = useState('');
  const [domain, setDomain] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [countries, setCountries] = useState([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [owner, setOwner] = useState('');

  const fetchCountries = (search) => {
    axios.get(`http://localhost:8082/country?search=${search === null ? "" : search}`)
      .then(response => {
        setCountries(response.data.countries);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  };

  const handleCountrySearchChange = (event) => {
    setCountrySearch((event.target.value))
    fetchCountries(countrySearch);
  }

  useEffect(() => {
    if (open) {
      fetchCountries('')
      axios.get(`http://localhost:8082/dns/${id}`)
        .then(response => {
          // Set the initial values in the state
          setIp(response.data.ip);
          setDomain(response.data.domain);
          setBusinessType(response.data.business_type);
          setSelectedCountry(response.data.country)
          setOwner(response.data.owner)
        })
        .catch(error => {
          console.error('Error fetching current values:', error);
        });
    }
  }, [open, id]);

  const handleSave = () => {
    const updatedData = {
      ip: ip,
      domain: domain,
      country: selectedCountry,
      business_type: businessType,
      owner: owner
    };

    // Send a PUT request to update the data
    axios.put(`http://localhost:8082/dns/${id}`, updatedData)
      .then(response => {
        console.log('Data updated successfully:', response.data);
        onClose(); // Close the modal after saving
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
    onClose(); // Close the modal after saving
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="ID"
          type="text"
          value={id}
          onChange={(e) => setIp(e.target.value)}
          fullWidth
          InputProps={{
              readOnly: true,
              sx: { color: 'rgba(0, 0, 0, 0.54)' }
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          label="IP"
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          label="Owner"
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Domain"
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          fullWidth
        />
      <Autocomplete
        options={countries}
        margin="dense"
        getOptionLabel={(option) => option.name}
        onChange={(event, value) => setSelectedCountry(value['name'])}
        onInputChange={handleCountrySearchChange}
        renderInput={(params) => (
          <TextField {...params} label="Select Country" variant="outlined" />
        )}
      />
        <Select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          displayEmpty
          fullWidth
          margin="dense"
          label="Business Type"
        >
          <MenuItem value="" disabled>
            Select Business Type
          </MenuItem>
          <MenuItem value="news">News</MenuItem>
          <MenuItem value="ecommerce">E-commerce</MenuItem>
          <MenuItem value="education">Education</MenuItem>
          <MenuItem value="government">Government</MenuItem>
          <MenuItem value="social">Social</MenuItem>
          <MenuItem value="others">Others</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDns;
