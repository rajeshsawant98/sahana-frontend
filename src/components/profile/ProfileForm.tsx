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

// Precompute both dark/light variants — only 2 objects ever exist
const fieldLabelStyles = {
  light: { mb: 1, color: '#666666', fontSize: '14px', fontWeight: 500 },
  dark:  { mb: 1, color: '#b0b0b0', fontSize: '14px', fontWeight: 500 },
} as const;

const textFieldStyles = {
  light: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff',
      color: '#333333',
      '& fieldset': { borderColor: '#ddd' },
      '&:hover fieldset': { borderColor: '#bbb' },
      '&.Mui-focused fieldset': { borderColor: '#1976d2' },
    },
    '& .MuiInputLabel-root': { color: '#666666' },
  },
  dark: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#2a2a2a',
      color: '#ffffff',
      '& fieldset': { borderColor: '#444444' },
      '&:hover fieldset': { borderColor: '#666666' },
      '&.Mui-focused fieldset': { borderColor: '#1976d2' },
    },
    '& .MuiInputLabel-root': { color: '#b0b0b0' },
  },
};

const textDisplayStyles = {
  light: { color: '#333333', py: 0.5, fontSize: '16px' },
  dark:  { color: '#ffffff', py: 0.5, fontSize: '16px' },
} as const;

const textDisplayBioStyles = {
  light: { color: '#333333', py: 0.5, fontSize: '16px', lineHeight: 1.5 },
  dark:  { color: '#ffffff', py: 0.5, fontSize: '16px', lineHeight: 1.5 },
} as const;

const buttonSx = { borderRadius: '8px', textTransform: 'none', px: 3, py: 1, fontSize: '14px' } as const;

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

  const mode = darkMode ? 'dark' : 'light';

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
            <Typography variant="body2" sx={fieldLabelStyles[mode]}>Full Name</Typography>
            {isEditing ? (
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth variant="outlined" size="small" sx={textFieldStyles[mode]} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={textDisplayStyles[mode]}>{profile.name || "Not provided"}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={fieldLabelStyles[mode]}>Birthday</Typography>
            {isEditing ? (
              <Controller
                name="birthdate"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="date" fullWidth variant="outlined" size="small" InputLabelProps={{ shrink: true }} sx={textFieldStyles[mode]} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={textDisplayStyles[mode]}>{profile.birthdate || "Not provided"}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={fieldLabelStyles[mode]}>Bio</Typography>
            {isEditing ? (
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField {...field} multiline rows={3} fullWidth variant="outlined" size="small" sx={textFieldStyles[mode]} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={textDisplayBioStyles[mode]}>{profile.bio || "No bio provided"}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={fieldLabelStyles[mode]}>Describe the kind of people you'd love to hang out with</Typography>
            {isEditing ? (
              <Controller
                name="vibe_description"
                control={control}
                render={({ field }) => (
                  <Box>
                    <TextField
                      {...field}
                      value={field.value || ''}
                      multiline
                      rows={3}
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="e.g. People who love live music, stay up late talking about ideas, and don't take themselves too seriously."
                      inputProps={{ maxLength: 500 }}
                      sx={textFieldStyles[mode]}
                    />
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: mode === 'dark' ? '#888' : '#999' }}
                    >
                      {(field.value || '').length} / 500
                    </Typography>
                  </Box>
                )}
              />
            ) : (
              <Typography variant="body1" sx={textDisplayBioStyles[mode]}>{profile.vibe_description || "Not provided"}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={fieldLabelStyles[mode]}>Profession</Typography>
            {isEditing ? (
              <Controller
                name="profession"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth variant="outlined" size="small" sx={textFieldStyles[mode]} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={textDisplayStyles[mode]}>{profile.profession || "Not specified"}</Typography>
            )}
          </Box>
        </Grid2>

        {/* Right Column */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={fieldLabelStyles[mode]}>Interests</Typography>
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
                    fullWidth variant="outlined" size="small" sx={textFieldStyles[mode]} 
                  />
                )}
              />
            ) : (
              <Typography variant="body1" sx={textDisplayStyles[mode]}>
                {Array.isArray(profile.interests) && profile.interests.length > 0 ? profile.interests.join(', ') : "No interests listed"}
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={fieldLabelStyles[mode]}>Phone Number</Typography>
            {isEditing ? (
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth variant="outlined" size="small" sx={textFieldStyles[mode]} />
                )}
              />
            ) : (
              <Typography variant="body1" sx={textDisplayStyles[mode]}>{profile.phoneNumber || "Not provided"}</Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={fieldLabelStyles[mode]}>Location</Typography>
            {isEditing ? (
              <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceChanged}>
                <TextField
                  fullWidth
                  placeholder="Enter your location"
                  value={locationInput}
                  onChange={handleLocationInputChange}
                  variant="outlined"
                  size="small"
                  sx={textFieldStyles[mode]}
                />
              </Autocomplete>
            ) : (
              <Typography variant="body1" sx={textDisplayStyles[mode]}>
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
            sx={buttonSx}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={buttonSx}
          >
            Save Changes
          </Button>
        </Box>
      )}
    </form>
  );
};
