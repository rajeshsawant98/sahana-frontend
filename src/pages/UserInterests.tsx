import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import { updateUserInterests } from "../apis/authAPI";
import { RootState, AppDispatch } from "../redux/store";
import { login } from "../redux/slices/authSlice";

// ⬇️ Load icons
const imageModules = import.meta.glob("../assets/categories/*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const categoryIcons: Record<string, string> = {};
for (const path in imageModules) {
  const key = path.split("/").pop()?.replace(".svg", "") || "";
  categoryIcons[key] = imageModules[path];
}

// ⬇️ Category list
const categories: Record<string, string[]> = {
  "Hobbies & Interests": ["Shopping", "Food", "Travel", "Technology"],
  "Art & Culture": ["Music", "Art", "Literature", "History"],
  "Sports & Recreation": ["Sports", "Fitness", "Outdoors", "Gaming"],
};

const UserInterests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load existing interests on mount
  useEffect(() => {
    if (user?.interests) {
      setSelectedCategories(user.interests);
    }
  }, [user]);

  const handleCategoryClick = (subcategory: string): void => {
    if (selectedCategories.includes(subcategory)) {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== subcategory));
    } else if (selectedCategories.length < 5) {
      setSelectedCategories((prev) => [...prev, subcategory]);
    }
  };

  const handleSavePreferences = async (): Promise<void> => {
    if (selectedCategories.length < 3) {
      alert("Please select at least 3 subcategories.");
      return;
    }

    if (!accessToken || !user) {
      alert("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      await updateUserInterests({ interests: selectedCategories });

      // Update Redux store with new interests
      dispatch(
        login({
          user: {
            ...user,
            interests: selectedCategories,
          },
          accessToken,
          role: user.role,
        })
      );

      alert("Preferences saved successfully!");
    } catch (error) {
      alert("Error saving preferences");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          marginTop: 4,
          paddingX: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Pick Your Interests!
        </Typography>

        {Object.entries(categories).map(([mainCategory, subcategoryList]) => (
          <Box key={mainCategory} sx={{ width: "100%", maxWidth: "850px" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>
              {mainCategory}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                marginBottom: 3,
              }}
            >
              {subcategoryList.map((subcategoryName) => (
                <Box
                  key={subcategoryName}
                  onClick={() => handleCategoryClick(subcategoryName)}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    width: "200px",
                    height: "200px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: selectedCategories.includes(subcategoryName)
                      ? "4px solid #FFBF49"
                      : "2px solid #E0E0E0",
                    "&:hover": {
                      border: "4px solid #FFBF49",
                    },
                  }}
                >
                  <img
                    src={categoryIcons[subcategoryName]}
                    alt={subcategoryName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "#FFFFFF",
                      textAlign: "center",
                      fontWeight: "bold",
                      padding: "4px 0",
                    }}
                  >
                    {subcategoryName}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSavePreferences}
          sx={{ marginTop: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save Interests"}
        </Button>
      </Box>
    </>
  );
};

export default UserInterests;
