import  { useState } from 'react';
import { TextField, Button, FormControl, FormHelperText } from '@mui/material';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation
    const validationErrors = {};
    if (!formData.firstName || formData.firstName.length < 2) {
      validationErrors.firstName = 'First name is required and must be at least 2 characters long.';
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      validationErrors.lastName = 'Last name is required and must be at least 2 characters long.';
    }
    if (!formData.email || !isValidEmail(formData.email)) {
      validationErrors.email = 'Email is required and must be in email format.';
    }
    if (!formData.age || isNaN(formData.age) || formData.age < 18 || formData.age > 120) {
      validationErrors.age = 'Age is required and must be between 18 and 120.';
    }
    if (!formData.password || formData.password.length < 6 || !isValidPassword(formData.password)) {
      validationErrors.password = 'Password is required and must be at least 6 characters long, containing letters, numbers, and special characters.';
    }
    setErrors(validationErrors);
  };

  const isValidEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;
    return passwordRegex.test(password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth error={Boolean(errors.firstName)}>
        <TextField
          name="firstName"
          label="First Name"
          variant="outlined"
          value={formData.firstName}
          onChange={handleChange}
          error={Boolean(errors.firstName)}
        />
        {errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth error={Boolean(errors.lastName)}>
        <TextField
          name="lastName"
          label="Last Name"
          variant="outlined"
          value={formData.lastName}
          onChange={handleChange}
          error={Boolean(errors.lastName)}
        />
        {errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth error={Boolean(errors.email)}>
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
        />
        {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth error={Boolean(errors.age)}>
        <TextField
          name="age"
          label="Age"
          variant="outlined"
          type="number"
          value={formData.age}
          onChange={handleChange}
          error={Boolean(errors.age)}
        />
        {errors.age && <FormHelperText>{errors.age}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth error={Boolean(errors.password)}>
        <TextField
          name="password"
          label="Password"
          variant="outlined"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
        />
        {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
      </FormControl>

      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
    </form>
  );
};

export default UserRegister;
