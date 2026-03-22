import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Grid2,
  Button,
  Chip,
} from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';
import { User, Location } from '../../types/User';
import { useLocationAutocomplete } from '../../hooks/useLocationAutocomplete';

const fieldLabelSx = {
  mb: 0.75,
  color: 'text.secondary',
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
} as const;

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontSize: '0.95rem',
  },
} as const;

const displayValueSx = {
  py: 0.5,
  fontSize: '0.95rem',
  lineHeight: 1.6,
  color: 'text.primary',
} as const;

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
  const { control, handleSubmit, reset, setValue } = useForm<Partial<User>>({
    defaultValues: profile
  });

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

  useEffect(() => {
    if (profile.location) {
      setLocationInput(profile.location.name || `${profile.location.city}, ${profile.location.country}`);
    }
  }, [profile.location, setLocationInput]);

  const handleFormSubmit = (data: Partial<User>) => {
    const formattedData = { ...data };
    if (typeof data.interests === 'string') {
      formattedData.interests = (data.interests as string).split(',').map((i: string) => i.trim()).filter((i: string) => i);
    }
    onSubmit(formattedData);
  };

  // Render a field row
  const renderField = (
    label: string,
    name: keyof User,
    displayValue: React.ReactNode,
    editInput: React.ReactNode
  ) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={fieldLabelSx}>{label}</Typography>
      {isEditing ? editInput : (
        <Typography variant="body1" sx={displayValueSx}>
          {displayValue || <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>Not provided</Box>}
        </Typography>
      )}
    </Box>
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid2 container spacing={4}>
        {/* Left Column */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          {renderField('Full Name', 'name', profile.name,
            <Controller name="name" control={control} render={({ field }) => (
              <TextField {...field} fullWidth variant="outlined" size="small" sx={textFieldSx} />
            )} />
          )}

          {renderField('Birthday', 'birthdate', profile.birthdate,
            <Controller name="birthdate" control={control} render={({ field }) => (
              <TextField {...field} type="date" fullWidth variant="outlined" size="small" InputLabelProps={{ shrink: true }} sx={textFieldSx} />
            )} />
          )}

          {renderField('Bio', 'bio', profile.bio,
            <Controller name="bio" control={control} render={({ field }) => (
              <TextField {...field} multiline rows={3} fullWidth variant="outlined" size="small" sx={textFieldSx} />
            )} />
          )}

          {renderField('Your Vibe', 'vibe_description', profile.vibe_description,
            <Controller name="vibe_description" control={control} render={({ field }) => (
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
                  sx={textFieldSx}
                />
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}>
                  {(field.value || '').length} / 500
                </Typography>
              </Box>
            )} />
          )}

          {renderField('Profession', 'profession', profile.profession,
            <Controller name="profession" control={control} render={({ field }) => (
              <TextField {...field} fullWidth variant="outlined" size="small" sx={textFieldSx} />
            )} />
          )}
        </Grid2>

        {/* Right Column */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={fieldLabelSx}>Interests</Typography>
            {isEditing ? (
              <Controller name="interests" control={control} render={({ field }) => (
                <TextField
                  {...field}
                  value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Enter interests separated by commas"
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={textFieldSx}
                />
              )} />
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, py: 0.5 }}>
                {Array.isArray(profile.interests) && profile.interests.length > 0 ? (
                  profile.interests.map((interest, i) => (
                    <Chip
                      key={i}
                      label={interest}
                      size="small"
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        backgroundColor: 'rgba(255, 191, 73, 0.12)',
                        color: '#FFBF49',
                        border: '1px solid rgba(255, 191, 73, 0.25)',
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body1" sx={{ ...displayValueSx, color: 'text.disabled', fontStyle: 'italic' }}>
                    No interests listed
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {renderField('Phone Number', 'phoneNumber', profile.phoneNumber,
            <Controller name="phoneNumber" control={control} render={({ field }) => (
              <TextField {...field} fullWidth variant="outlined" size="small" sx={textFieldSx} />
            )} />
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={fieldLabelSx}>Location</Typography>
            {isEditing ? (
              <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceChanged}>
                <TextField
                  fullWidth
                  placeholder="Enter your location"
                  value={locationInput}
                  onChange={handleLocationInputChange}
                  variant="outlined"
                  size="small"
                  sx={textFieldSx}
                />
              </Autocomplete>
            ) : (
              <Typography variant="body1" sx={displayValueSx}>
                {profile.location?.city && profile.location?.country
                  ? `${profile.location.city}, ${profile.location.country}`
                  : <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>Not provided</Box>}
              </Typography>
            )}
          </Box>
        </Grid2>
      </Grid2>

      {isEditing && (
        <Box sx={{ mt: 2, pt: 3, display: 'flex', gap: 1.5, justifyContent: 'flex-end', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{ borderRadius: '100px', px: 2.5, height: 36, fontSize: '0.8rem' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{ borderRadius: '100px', px: 3, height: 36, fontSize: '0.8rem' }}
          >
            Save Changes
          </Button>
        </Box>
      )}
    </form>
  );
};
