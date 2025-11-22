import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Box, 
  Typography, 
  TextField, 
  Grid2, 
  Button 
} from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';
import { User, Location } from '../../types/User';
import { useLocationAutocomplete } from '../../hooks/useLocationAutocomplete';

interface ProfileFormProps {
  profile: Partial<User>;
  isEditing: boolean;
  darkMode: boolean;
  onCancel: () => void;
  onSubmit: (data: Partial<User>) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  isEditing,
  darkMode,
  onCancel,
  onSubmit
}) => {
  const { control, handleSubmit, reset, setValue, watch } = useForm<Partial<User>>({
    defaultValues: profile
  });

  // Update form when profile changes
  useEffect(() => {
    reset(profile);
  }, [profile, reset]);

  const { 
    locationInput, 
    handleLocationInputChange, 
    handlePlaceChanged, 
    onLoad,
    setLocationInput
  } = useLocationAutocomplete({
    initialLocation: profile.location || undefined,
    onLocationChange: (loc) => setValue('location', loc)
  });
  
  // Sync location input when profile changes (if not editing or just switched)
  useEffect(() => {
    if (profile.location) {
        setLocationInput(profile.location.name || `${profile.location.city}, ${profile.location.country}`);
    }
  }, [profile.location, setLocationInput]);

  // Helper styles
  const getFieldLabelStyle = () => ({
    mb: 1,
    color: darkMode ? '#b0b0b0' : '#666666',
    fontSize: '14px',
    fontWeight: 500
  });

  const getTextFieldStyle = () => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#333333',
      '& fieldset': { borderColor: darkMode ? '#444444' : '#ddd' },
      '&:hover fieldset': { borderColor: darkMode ? '#666666' : '#bbb' },
      '&.Mui-focused fieldset': { borderColor: '#1976d2' }
    },
    '& .MuiInputLabel-root': { color: darkMode ? '#b0b0b0' : '#666666' }
  });

  const getTextDisplayStyle = () => ({
    color: darkMode ? '#ffffff' : '#333333',
    py: 0.5,
    fontSize: '16px'
  });

  const handleFormSubmit = (data: Partial<User>) => {
    // Handle interests string to array conversion if needed, 
    // but react-hook-form can handle it if we parse it in the input or before submit.
    // Here we assume the input is a string and we convert it.
    // Wait, the original code did: value.split(',')...
    
    // We can do the transformation here
    const formattedData = { ...data };
    if (typeof data.interests === 'string') {
        formattedData.interests = (data.interests as string).split(',').map((i: string) => i.trim()).filter((i: string) => i);
    }
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid2 container spacing={4}>
        {/* Left Column */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={getFieldLabelStyle()}>Full Name</Typography>
            {isEditing ? (
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth variant="outlined" size="small" sx={getTextFieldStyle()} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={getTextDisplayStyle()}>{profile.name || "Not provided"}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={getFieldLabelStyle()}>Birthday</Typography>
            {isEditing ? (
              <Controller
                name="birthdate"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="date" fullWidth variant="outlined" size="small" InputLabelProps={{ shrink: true }} sx={getTextFieldStyle()} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={getTextDisplayStyle()}>{profile.birthdate || "Not provided"}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={getFieldLabelStyle()}>Bio</Typography>
            {isEditing ? (
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField {...field} multiline rows={3} fullWidth variant="outlined" size="small" sx={getTextFieldStyle()} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={{ ...getTextDisplayStyle(), lineHeight: 1.5 }}>{profile.bio || "No bio provided"}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={getFieldLabelStyle()}>Profession</Typography>
            {isEditing ? (
              <Controller
                name="profession"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth variant="outlined" size="small" sx={getTextFieldStyle()} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={getTextDisplayStyle()}>{profile.profession || "Not specified"}</Typography>
            )}
          </Box>
        </Grid2>

        {/* Right Column */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={getFieldLabelStyle()}>Interests</Typography>
            {isEditing ? (
              <Controller
                name="interests"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Enter interests separated by commas"
                    fullWidth variant="outlined" size="small" sx={getTextFieldStyle()} 
                  />
                )}
              />
            ) : (
              <Typography variant="body1" sx={getTextDisplayStyle()}>
                {Array.isArray(profile.interests) && profile.interests.length > 0 ? profile.interests.join(', ') : "No interests listed"}
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={getFieldLabelStyle()}>Phone Number</Typography>
            {isEditing ? (
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth variant="outlined" size="small" sx={getTextFieldStyle()} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={getTextDisplayStyle()}>{profile.phoneNumber || "Not provided"}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={getFieldLabelStyle()}>Location</Typography>
            {isEditing ? (
              <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceChanged}>
                <TextField
                  fullWidth
                  placeholder="Enter your location"
                  value={locationInput}
                  onChange={handleLocationInputChange}
                  variant="outlined"
                  size="small"
                  sx={getTextFieldStyle()}
                />
              </Autocomplete>
            ) : (
              <Typography variant="body1" sx={getTextDisplayStyle()}>
                {profile.location?.city && profile.location?.country 
                  ? `${profile.location.city}, ${profile.location.country}` 
                  : 'Not provided'}
              </Typography>
            )}
          </Box>
        </Grid2>
      </Grid2>

      {isEditing && (
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, py: 1, fontSize: '14px' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, py: 1, fontSize: '14px' }}
          >
            Save Changes
          </Button>
        </Box>
      )}
    </form>
  );
};
