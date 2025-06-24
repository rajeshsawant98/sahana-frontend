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
  Collapse,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
    formState: { errors },
  } = useForm<EventFormData>({ defaultValues: initialValues });

  const [descOpen, setDescOpen] = useState<boolean>(!!initialValues.description);
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
          <Box display="flex" alignItems="center" gap={1}>
            <ExpandMoreIcon fontSize="small" />
            <Typography
              onClick={() => setDescOpen((prev) => !prev)}
              sx={{ cursor: "pointer", fontWeight: 500 }}
            >
              {descOpen ? "Hide description" : "Add description"}
            </Typography>
          </Box>
          <Collapse in={descOpen}>
            <TextField
              fullWidth
              label="Event Description"
              multiline
              rows={4}
              sx={{ mt: 2 }}
              {...register("description", { required: "Description is required" })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Collapse>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={500} mb={1}>Event Banner</Typography>
          <Box display="flex" gap={3} flexDirection={{ xs: "column", sm: "row" }}>
            <Box
              sx={{
                width: 240,
                height: 150,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                bgcolor: "#f5f5f5",
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
                <Box
                  sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}
                >
                  No image yet
                </Box>
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
                    px: 2,
                    py: 1,
                    border: "1px solid",
                    borderRadius: 1,
                    cursor: "pointer",
                  }}
                >
                  {imageFile || initialValues.imageUrl ? "Replace Image" : "Upload Image"}
                </Box>
              </label>
              {imageFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {imageFile.name}
                </Typography>
              )}
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
          <FormControl fullWidth>
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
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Autocomplete onLoad={(a) => (autocompleteRef.current = a)} onPlaceChanged={handlePlaceChanged}>
            <TextField
              fullWidth
              label="Location"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </Autocomplete>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={isOnline} onChange={(e) => { setIsOnline(e.target.checked); setValue("isOnline", e.target.checked); }} />}
            label="Online Event"
          />
          {isOnline && (
            <TextField
              fullWidth
              label="Join Link"
              {...register("joinLink", { required: "Join Link is required" })}
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
            onChange={(_, newValue) => setOrganizers(newValue as string[])}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
            }
            renderInput={(params) => <TextField {...params} label="Organizers" />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <MuiAutocomplete
            multiple
            freeSolo
            options={[]}
            value={moderators}
            onChange={(_, newValue) => setModerators(newValue as string[])}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
            }
            renderInput={(params) => <TextField {...params} label="Moderators" />}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default EventForm;
