import { createTheme, Theme } from "@mui/material/styles";

// Create theme with the specified color palette
const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#FFBF49", // Golden Yellow
    },
    secondary: {
      main: "#49A3FF", // Cool Blue
    },
    background: {
      default: "#f5f5f5", // Neutral Gray for the body background
      paper: "#ffffff", // White paper background for cards, dialogs, etc.
    },
    text: {
      primary: "#212121", // Dark text for primary text (black or dark gray)
      secondary: "#757575", // Light gray text for secondary text
    },
    action: {
      hover: "#4CAF50", // Muted Green for hover on buttons, links, etc.
      disabled: "#9E9E9E", // Gray for disabled state
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons for a modern look
          height: 45, // Match the height of the text fields
          padding: "12px 16px", // Adjust padding to ensure proper height
          fontWeight: 600, // Make button text slightly bolder
          textTransform: "none", // Prevent uppercase transformation
          "&:hover": {
            backgroundColor: "#FFA500", // Slightly darker golden yellow on hover
            boxShadow: "0 4px 8px rgba(255, 191, 73, 0.3)", // Add shadow on hover
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#333333", // Use Cool Blue for links
          textDecoration: "none", // Remove underline from links
          "&:hover": {
            color: "#FFBF49", // Muted Green on hover
            textDecoration: "none", // Keep the underline removed on hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // More rounded corners for card components
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)", // Enhanced shadow on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#FFBF49", // Set the border color to golden yellow
            },
            "&:hover fieldset": {
              borderColor: "#FFBF49", // Set the border color on hover to golden yellow
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFBF49", // Set the border color on focus to golden yellow
            },
            "& input": {
              color: "#212121", // Set the text color to dark gray for the input (better readability)
            },
            "& input::placeholder": {
              color: "#757575", // Light gray placeholder text (better readability)
              lineHeight: "24px",
            },
            height: 50, // Set the height of the text field
          },
          "& .MuiInputLabel-root": {
            color: "#FFBF49", // Golden yellow color for the label
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FFBF49", // Golden yellow color when label is focused
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#FFBF49", // Golden yellow color for the label
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FFBF49", // Golden yellow color when label is focused
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#FFBF49", // Set the border color to golden yellow
            },
            "&:hover fieldset": {
              borderColor: "#FFBF49", // Set the border color on hover to golden yellow
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFBF49", // Set the border color on focus to golden yellow
            },
            "& input": {
              color: "#212121", // Set the text color to dark gray for the input (better readability)
            },
            "& input::placeholder": {
              color: "#757575", // Light gray placeholder text (better readability)
              lineHeight: "24px",
            },
            "& .MuiSelect-select": {
              color: "#212121", // Set the text color to dark gray for the select input (better readability)
            },
          },
        },
      },
    },
  },
});

export default theme;
