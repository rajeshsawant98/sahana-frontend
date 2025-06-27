// Refactored EventForm — removed embedded buttons
import React, { useRef, useEffect, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import { useForm, Controller } from "react-hook-form";
import { Autocomplete as MuiAutocomplete } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase_init";
import { v4 as uuidv4 } from "uuid";
import { LocationData } from "../types/User";

interface EventFormData {
  eventName: string;
  description: string;
  imageUrl?: string;
  startTime: string;
  duration: number;
  categories: string[];
  location?: LocationData;
  isOnline: boolean;
  joinLink?: string;
  organizers: string[];
  moderators: string[];
}

interface EventFormProps {
  initialValues?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
}

const EventForm: React.FC<EventFormProps> = ({ initialValues = {}, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({ defaultValues: initialValues });

  const [isOnline, setIsOnline] = useState<boolean>(initialValues.isOnline || false);
  const [organizers, setOrganizers] = useState<string[]>(initialValues.organizers || []);
  const [moderators, setModerators] = useState<string[]>(initialValues.moderators || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locationInput, setLocationInput] = useState<string>(initialValues.location?.formattedAddress || "");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (initialValues) {
      Object.keys(initialValues).forEach((key) => {
        const typedKey = key as keyof EventFormData;
        setValue(typedKey, initialValues[typedKey] as any);
      });
    }
  }, [initialValues, setValue]);

  const handlePlaceChanged = (): void => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();
        const formattedAddress = place.formatted_address;
        const name = place.name;
        const city = place.address_components?.find((comp) => comp.types.includes("locality"))?.long_name;
        const country = place.address_components?.find((comp) => comp.types.includes("country"))?.long_name;
        const state = place.address_components?.find((comp) => comp.types.includes("administrative_area_level_1"))?.short_name;

        if (lat !== undefined && lng !== undefined) {
          setValue("location", {
            latitude: lat,
            longitude: lng,
            city: city || "",
            state: state || "",
            country: country || "",
            formattedAddress: formattedAddress || "",
            name: name || "",
          });

          setLocationInput(`${name || ""}, ${formattedAddress || ""}`);
        }
      }
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `events/${uuidv4()}_${file.name}`;
    const imageRef = ref(storage, fileName);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const internalSubmit = async (data: EventFormData): Promise<void> => {
    // Validate location for in-person events
    if (!data.isOnline && !locationInput.trim()) {
      return; // Form validation will show error
    }

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      data.imageUrl = imageUrl;
    }

    data.organizers = organizers;
    data.moderators = moderators;
    data.duration = parseInt(data.duration.toString(), 10);
    onSubmit(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Event Name"
            {...register("eventName", { required: "Event Name is required" })}
            error={!!errors.eventName}
            helperText={errors.eventName?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Event Description"
            multiline
            minRows={3}
            maxRows={10}
            placeholder="Describe your event..."
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={{
              '& .MuiInputBase-root': {
                alignItems: 'flex-start',
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={500} mb={1}>Event Banner</Typography>
          <Box display="flex" gap={3} flexDirection={{ xs: "column", sm: "row" }} alignItems="flex-start">
            <Box
              sx={{
                width: 240,
                height: 150,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                bgcolor: "#f5f5f5",
                border: "2px dashed #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : initialValues.imageUrl ? (
                <img
                  src={initialValues.imageUrl}
                  alt="Existing Event"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No image yet
                </Typography>
              )}
            </Box>
            <Box>
              <input
                hidden
                type="file"
                id="upload-image"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="upload-image">
                <Box
                  component="span"
                  sx={{
                    px: 3,
                    py: 1.5,
                    border: "1px solid #FFBF49",
                    borderRadius: 1,
                    cursor: "pointer",
                    display: "inline-block",
                    color: "#FFBF49",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#FFBF49",
                      color: "white",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {imageFile || initialValues.imageUrl ? "Replace Image" : "Upload Image"}
                </Box>
              </label>
              {imageFile && (
                <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                  Selected: {imageFile.name}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Recommended: 1200x600px, max 5MB
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="datetime-local"
            label="Start Time"
            InputLabelProps={{ shrink: true }}
            {...register("startTime", { required: "Start Time is required" })}
            error={!!errors.startTime}
            helperText={errors.startTime?.message}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            label="Duration (min)"
            {...register("duration", { required: "Duration is required", min: { value: 1, message: "Minimum 1 minute" } })}
            error={!!errors.duration}
            helperText={errors.duration?.message}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth error={!!errors.categories}>
            <InputLabel>Categories</InputLabel>
            <Controller
              name="categories"
              control={control}
              defaultValue={[]}
              rules={{ required: "Select at least one category" }}
              render={({ field }) => (
                <Select multiple {...field} label="Categories">
                  {["Fitness", "Sports", "Art", "Technology", "Music"].map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.categories && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                {errors.categories.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Autocomplete onLoad={(a) => (autocompleteRef.current = a)} onPlaceChanged={handlePlaceChanged}>
            <TextField
              fullWidth
              label="Location"
              placeholder="Search for a location..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              error={!isOnline && !locationInput.trim()}
              helperText={!isOnline && !locationInput.trim() ? "Location is required for in-person events" : ""}
            />
          </Autocomplete>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={isOnline} 
                onChange={(e) => { 
                  setIsOnline(e.target.checked); 
                  setValue("isOnline", e.target.checked);
                  // Clear join link if unchecked
                  if (!e.target.checked) {
                    setValue("joinLink", "");
                  }
                }} 
              />
            }
            label="Online Event"
          />
          {isOnline && (
            <TextField
              fullWidth
              label="Join Link"
              placeholder="https://zoom.us/j/..."
              {...register("joinLink", { 
                required: isOnline ? "Join Link is required for online events" : false 
              })}
              error={!!errors.joinLink}
              helperText={errors.joinLink?.message}
              sx={{ mt: 2 }}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <MuiAutocomplete
            multiple
            freeSolo
            options={[]}
            value={organizers}
            onChange={(_, newValue) => {
              // Filter out empty strings and trim whitespace
              const filteredValues = newValue
                .map(val => val.trim())
                .filter(val => val.length > 0);
              setOrganizers(filteredValues);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  variant="outlined" 
                  label={option} 
                  {...getTagProps({ index })}
                  key={index}
                />
              ))
            }
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Organizers" 
                placeholder="Type name and press Enter"
                helperText="Enter names of people organizing this event"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <MuiAutocomplete
            multiple
            freeSolo
            options={[]}
            value={moderators}
            onChange={(_, newValue) => {
              // Filter out empty strings and trim whitespace
              const filteredValues = newValue
                .map(val => val.trim())
                .filter(val => val.length > 0);
              setModerators(filteredValues);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  variant="outlined" 
                  label={option} 
                  {...getTagProps({ index })}
                  key={index}
                />
              ))
            }
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Moderators" 
                placeholder="Type name and press Enter"
                helperText="Enter names of people moderating this event"
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default EventForm;
