import { createTheme, Theme } from "@mui/material/styles";

// Create a function that returns a theme based on dark mode preference
export const createAppTheme = (darkMode: boolean): Theme => {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: "#FFBF49", // Golden Yellow - same for both modes
      },
      secondary: {
        main: "#49A3FF", // Cool Blue - same for both modes
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5", // Dark gray for dark mode, light gray for light mode
        paper: darkMode ? "#1e1e1e" : "#ffffff", // Dark paper for dark mode, white for light mode
      },
      text: {
        primary: darkMode ? "#ffffff" : "#212121", // White text for dark mode, dark text for light mode
        secondary: darkMode ? "#b0b0b0" : "#757575", // Light gray for dark mode, darker gray for light mode
      },
      action: {
        hover: "#4CAF50", // Muted Green for hover - same for both modes
        disabled: "#9E9E9E", // Gray for disabled state - same for both modes
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
            color: darkMode ? "#ffffff" : "#333333", // Adapt link color based on theme
            textDecoration: "none", // Remove underline from links
            "&:hover": {
              color: "#FFBF49", // Golden yellow on hover for both themes
              textDecoration: "none", // Keep the underline removed on hover
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12, // More rounded corners for card components
            boxShadow: darkMode 
              ? "0 2px 8px rgba(0, 0, 0, 0.3)" 
              : "0 2px 8px rgba(0, 0, 0, 0.1)", // Stronger shadow for dark mode
            "&:hover": {
              boxShadow: darkMode 
                ? "0 4px 16px rgba(0, 0, 0, 0.4)" 
                : "0 4px 16px rgba(0, 0, 0, 0.15)", // Enhanced shadow on hover
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
                color: darkMode ? "#ffffff" : "#212121", // Adapt input text color
              },
              "& input::placeholder": {
                color: darkMode ? "#b0b0b0" : "#757575", // Adapt placeholder color
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
                color: darkMode ? "#ffffff" : "#212121", // Adapt input text color
              },
              "& input::placeholder": {
                color: darkMode ? "#b0b0b0" : "#757575", // Adapt placeholder color
                lineHeight: "24px",
              },
              "& .MuiSelect-select": {
                color: darkMode ? "#ffffff" : "#212121", // Adapt text color based on theme
              },
            },
          },
        },
      },
    },
  });
};

// Default theme (light mode)
const theme: Theme = createAppTheme(false);

export default theme;
