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

const CreateDns = ({ open, onClose, id }) => {
  const [ip, setIp] = useState('');
  const [domain, setDomain] = useState('');
  const [domainError, setDomainError] = useState({ state: false, message: "" });
  const [businessType, setBusinessType] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [owner, setOwner] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  const fetchCountries = (search) => {
    axios.get(`http://localhost:8082/country?search=${search}`)
      .then(response => {
        setCountries(response.data.countries);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  };

    useEffect(() => {
    if (open){
      fetchCountries("")
    }
  }, [open]);

  const resetFields = () => {
    setIp('');
    setDomain('');
    setDomainError({ state: false, message: "" });
    setBusinessType('');
    setSelectedCountry('');
  };

  const handleSave = () => {
    if (!validateDomain(domain)) {
      setDomainError({ state: true, message: 'Example: www.ali.com' });
      return;
    }

    const createdData = {
      ip: ip,
      domain: domain,
      owner: owner,
      business_type: businessType,
      country: selectedCountry // Include selected country in the request payload
    };

    axios.post("http://localhost:8082/dns", createdData)
      .then(response => {
        resetFields();
        onClose();
      })
      .catch(error => {
        if (error.response.status === 409) {
          setDomainError({ state: true, message: "Domain already taken" });
        }
      });
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const validateDomain = (domain) => {
    const domainRegex = /^www\.[A-Za-z0-9]+\.[A-Za-z0-9]+$/;
    return domainRegex.test(domain);
  };

  const handleDomainInput = (event) => {
    const { value } = event.target;
    setDomain(value);
    setDomainError({ state: !validateDomain(value), message: "Example: www.ali.com" });
  };

  const handleBusinessTypeChange = (event) => {
    setBusinessType(event.target.value);
  };

  const handleCountrySearchChange = (event) => {
    setCountrySearch((event.target.value))
    fetchCountries(countrySearch);
  }

 return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create DNS</DialogTitle>
      <DialogContent>
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
          error={domainError.state}
          helperText={domainError.state ? domainError.message : ''}
          margin="dense"
          label="Domain"
          type="text"
          value={domain}
          onInput={handleDomainInput}
          fullWidth
          inputProps={{
            pattern: "^www\\.[A-Za-z0-9]+\\.[A-Za-z0-9]+$"
          }}
        />
        <Select
          value={businessType}
          margin="dense"
          onChange={handleBusinessTypeChange}
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
    <Autocomplete
      options={countries}
      margin="dense"
      getOptionLabel={(option) => option.name}
      onChange={(event, value) => setSelectedCountry(value.name)}
      onInputChange={handleCountrySearchChange}
      renderInput={(params) => (
        <TextField {...params} label="Select Country" variant="outlined" />
      )}
    />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDns;
