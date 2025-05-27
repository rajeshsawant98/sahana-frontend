// CreateEvent.jsx (revised)

import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
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
  Paper,
  Snackbar,
  Collapse,
  Autocomplete as MuiAutocomplete,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete } from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { addCreatedEventLocal } from "../redux/slices/userEventsSlice";
import axiosInstance from "../utils/axiosInstance";
import { v4 as uuidv4 } from "uuid";
import NavBar from "../components/NavBar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase_init";

const CreateEvent = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const profile = useSelector((state) => state.auth.user);
  const initialized = useSelector((state) => state.auth.initialized);
  const dispatch = useDispatch();

  const [isOnline, setIsOnline] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [organizers, setOrganizers] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const autocompleteRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address;
        const name = place.name;
        const city = place.address_components.find((comp) =>
          comp.types.includes("locality")
        )?.long_name;
        const country = place.address_components.find((comp) =>
          comp.types.includes("country")
        )?.long_name;
        const state = place.address_components.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.short_name;

        setValue("location", {
          latitude: lat,
          longitude: lng,
          city: city || "",
          state: state || "",
          country: country || "",
          name: name || "",
          formattedAddress: formattedAddress || "",
        });

        setLocationInput(`${name || ""}, ${formattedAddress || ""}`);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!profile?.email || !profile?.name) {
        console.warn("Missing profile info for event creation");
        return;
      }

      data.duration = parseInt(data.duration, 10);
      data.createdBy = profile.name;
      data.createdByEmail = profile.email;

      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        console.log("Image uploaded to:", imageUrl);
        data.imageUrl = imageUrl;
      }

      console.log("Creating event with data:", data);

      const eventRes = await axiosInstance.post("/events/new", data);
      const eventId = eventRes.data.eventId;

      await axiosInstance.patch(`/events/${eventId}/organizers`, {
        organizerEmails: organizers,
      });

      await axiosInstance.patch(`/events/${eventId}/moderators`, {
        moderatorEmails: moderators,
      });

      dispatch(addCreatedEventLocal({ ...data, eventId }));
      setSuccessOpen(true);
      reset();
      setLocationInput("");
      setOrganizers([]);
      setModerators([]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const uploadImage = async (file) => {
    const fileName = `events/${uuidv4()}_${file.name}`;
    const imageRef = ref(storage, fileName);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  if (!initialized) return <Typography>Loading profile...</Typography>;
  if (!profile?.email || !profile?.name)
    return <Typography>Profile incomplete.</Typography>;

  return (
    <>
      <NavBar />
      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Create Event
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Name"
                  {...register("eventName", {
                    required: "Event Name is required",
                  })}
                  error={!!errors.eventName}
                  helperText={errors.eventName?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  endIcon={<ExpandMoreIcon />}
                  onClick={() => setDescOpen((prev) => !prev)}
                >
                  {descOpen ? "Hide description" : "Add description"}
                </Button>
                <Collapse in={descOpen}>
                  <TextField
                    fullWidth
                    label="Event Description"
                    multiline
                    rows={4}
                    sx={{ mt: 2 }}
                    {...register("description", {
                      required: "Description is required",
                    })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Collapse>
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" component="label">
                  Upload Banner
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </Button>
                {imageFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {imageFile.name}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Start Time"
                  InputLabelProps={{ shrink: true }}
                  {...register("startTime", {
                    required: "Start Time is required",
                  })}
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (min)"
                  {...register("duration", {
                    required: "Duration is required",
                    min: { value: 1, message: "Minimum 1 minute" },
                  })}
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
                        {[
                          "Fitness",
                          "Sports",
                          "Art",
                          "Technology",
                          "Music",
                        ].map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  onLoad={(a) => (autocompleteRef.current = a)}
                  onPlaceChanged={handlePlaceChanged}
                >
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
                  control={
                    <Checkbox
                      checked={isOnline}
                      onChange={(e) => {
                        setIsOnline(e.target.checked);
                        setValue("isOnline", e.target.checked);
                      }}
                    />
                  }
                  label="Online Event"
                />
                {isOnline && (
                  <TextField
                    fullWidth
                    label="Join Link"
                    {...register("joinLink", {
                      required: "Join Link is required",
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
                  onChange={(_, newValue) => setOrganizers(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Organizers" />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <MuiAutocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={moderators}
                  onChange={(_, newValue) => setModerators(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Moderators" />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Button
                    color="inherit"
                    onClick={reset}
                    startIcon={<CloseIcon />}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" type="submit">
                    Create Event
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        message="Event created successfully"
      />
    </>
  );
};

export default CreateEvent;
