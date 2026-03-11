import { createTheme, Theme } from "@mui/material/styles";

const createAppTheme = (darkMode: boolean): Theme => {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: "#FFBF49",
        contrastText: "#000000",
      },
      secondary: {
        main: "#49A3FF",
      },
      background: {
        default: darkMode ? "#0c0c0c" : "#f9f9f7",
        paper: darkMode ? "#161616" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#f2f2f2" : "#111111",
        secondary: darkMode ? "#888888" : "#666666",
      },
      divider: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
      action: {
        hover: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        disabled: "#9E9E9E",
      },
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      h1: { fontWeight: 800, letterSpacing: "-2px" },
      h2: { fontWeight: 700, letterSpacing: "-1px" },
      h3: { fontWeight: 700, letterSpacing: "-0.5px" },
      h4: { fontWeight: 700, letterSpacing: "-0.3px" },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, letterSpacing: "-0.1px" },
      body1: { lineHeight: 1.65 },
      body2: { lineHeight: 1.6 },
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            height: 40,
            padding: "8px 18px",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.875rem",
            transition: "all 0.15s ease",
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(255, 191, 73, 0.35)",
              backgroundColor: "#FFA500",
            },
          },
          outlined: {
            borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
            "&:hover": {
              borderColor: "#FFBF49",
              backgroundColor: "rgba(255,191,73,0.06)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: darkMode ? "#f2f2f2" : "#111111",
            textDecoration: "none",
            "&:hover": {
              color: "#FFBF49",
              textDecoration: "none",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: "none",
            boxShadow: darkMode
              ? "0 2px 12px rgba(0, 0, 0, 0.4)"
              : "0 2px 12px rgba(0, 0, 0, 0.06)",
            border: darkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            fontSize: "0.8rem",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            minHeight: 40,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 2,
            borderRadius: 2,
            backgroundColor: "#FFBF49",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              "& fieldset": {
                borderColor: darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
              },
              "&:hover fieldset": {
                borderColor: "#FFBF49",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FFBF49",
              },
              "& input": {
                color: darkMode ? "#f2f2f2" : "#111111",
              },
              "& input::placeholder": {
                color: darkMode ? "#666666" : "#999999",
                lineHeight: "24px",
              },
              minHeight: 48,
              "&.MuiInputBase-multiline": {
                height: "auto",
                minHeight: "auto",
              },
            },
            "& .MuiInputLabel-root": {
              color: darkMode ? "#888888" : "#666666",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#FFBF49",
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            "& .MuiInputLabel-root": {
              color: darkMode ? "#888888" : "#666666",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#FFBF49",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              "& fieldset": {
                borderColor: darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
              },
              "&:hover fieldset": {
                borderColor: "#FFBF49",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FFBF49",
              },
              "& input": {
                color: darkMode ? "#f2f2f2" : "#111111",
              },
              "& input::placeholder": {
                color: darkMode ? "#666666" : "#999999",
                lineHeight: "24px",
              },
              "& .MuiSelect-select": {
                color: darkMode ? "#f2f2f2" : "#111111",
              },
            },
          },
        },
      },
    },
  });
};

const theme: Theme = createAppTheme(false);

export default theme;
export { createAppTheme };
