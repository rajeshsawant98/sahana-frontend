import React, { useState, useRef , useEffect } from "react";
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
} from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import axiosInstance from "../utils/axiosInstance";
import NavBar from "../components/NavBar";

const CreateEvent = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");
        console.log(data);
        setProfile(data);

      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const [isOnline, setIsOnline] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const city = place.address_components.find((comp) =>
          comp.types.includes("locality")
        )?.long_name;
        const country = place.address_components.find((comp) =>
          comp.types.includes("country")
        )?.long_name;

        setValue("location", {
          latitude: lat,
          longitude: lng,
          city: city || "",
          country: country || "",
        });

        setLocationInput(`${city || ""}, ${country || ""}`);
      }
    }
  };

  const onSubmit = (data) => {
    // Ensure duration is an integer before sending the request
    data.duration = parseInt(data.duration, 10);
    data.createdBy = profile.name;
    data.createdByEmail = profile.email;
    console.log("Submitting event:", data);
    axiosInstance
      .post("/events/new", data)
      .then((response) => {
        console.log("Event Created: ", response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Response Error:", error.response.data);
          // Check the response data for validation errors or missing fields
        } else if (error.request) {
          console.error("Request Error:", error.request);
        } else {
          console.error("Error Message:", error.message);
        }
      });
  };

  return (
    <>
      <NavBar />
      <Box sx={{ width: "100%", maxWidth: 600, margin: "auto", padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }} align="center">
          Create New Event
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Event Name"
            variant="outlined"
            {...register("eventName", { required: "Event Name is required" })}
            error={!!errors.eventName}
            helperText={errors.eventName?.message}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            fullWidth
            label="Event Description"
            variant="outlined"
            multiline
            rows={4}
            {...register("description", {
              required: "Description is required",
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            fullWidth
            label="Start Time"
            variant="outlined"
            type="datetime-local"
            {...register("startTime", { required: "Start Time is required" })}
            error={!!errors.startTime}
            helperText={errors.startTime?.message}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            fullWidth
            label="Duration (in minutes)"
            variant="outlined"
            type="number"
            {...register("duration", {
              required: "Duration is required",
              valueAsNumber: true,
              min: { value: 1, message: "Duration must be at least 1 minute" },
            })}
            onChange={(e) => setValue("duration", parseInt(e.target.value, 10))}
            error={!!errors.duration}
            helperText={errors.duration?.message}
            sx={{ marginBottom: 2 }}
          />

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Categories</InputLabel>
            <Controller
              name="categories"
              control={control}
              defaultValue={[]}
              rules={{ required: "At least one category is required" }}
              render={({ field }) => (
                <Select
                  multiple
                  value={field.value}
                  onChange={(event) =>
                    setValue("categories", event.target.value)
                  }
                  label="Categories"
                  error={!!errors.categories}
                >
                  <MenuItem value="Fitness">Fitness</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Art">Art</MenuItem>
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Music">Music</MenuItem>
                </Select>
              )}
            />
            {errors.categories && (
              <Typography variant="body2" color="error">
                {errors.categories.message}
              </Typography>
            )}
          </FormControl>

          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          </Autocomplete>

          <FormControlLabel
            control={
              <Checkbox
                checked={isOnline}
                onChange={(event) => {
                  setIsOnline(event.target.checked);
                  setValue("isOnline", event.target.checked);
                }}
              />
            }
            label="Online Event"
          />

          {isOnline && (
            <TextField
              fullWidth
              label="Join Link"
              variant="outlined"
              {...register("joinLink", { required: "Join Link is required" })}
              error={!!errors.joinLink}
              helperText={errors.joinLink?.message}
              sx={{ marginBottom: 2 }}
            />
          )}

          <Button fullWidth variant="contained" color="primary" type="submit">
            Create Event
          </Button>
        </form>
      </Box>
    </>
  );
};

export default CreateEvent;
