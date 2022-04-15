import {
  TextField,
  Box,
  Grid,
  Paper,
  Button,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import axios from "axios";
import WPAPI from "wpapi";
import { useRouter } from "next/router";

const Input = styled("input")({
  display: "none",
});

export default function Recipe() {
  const [type, setType] = useState("");
  const [origin, setOrigin] = useState("");
  const [media, setMedia] = useState("");
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);
  const history = useRouter();

  const handleType = (event) => {
    setType(event.target.value);
  };
  const handleOrigin = (event) => {
    setOrigin(event.target.value);
  };
  const handleFile = (event) => {
    event.target.files[0].size > 200000
      ? alert("File size too large")
      : setMedia(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const wp = new WPAPI({
      endpoint: "https://dev-wpsayeem.pantheonsite.io/wp-json",
    });

    let featured = "";

    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("__wp")).token}`,
    };
    const url = "https://dev-wpsayeem.pantheonsite.io/wp-json/wp/v2/posts";
    const mediaUrl = "https://dev-wpsayeem.pantheonsite.io/wp-json/wp/v2/media";
    const bearerToken = JSON.parse(localStorage.getItem("__wp")).token;
    try {
      if (media) {
        wp.setHeaders(
          "Authorization",
          `Bearer ${JSON.parse(localStorage.getItem("__wp")).token}`
        );
        featured = await wp.media().file(media).create({
          title: media.name,
          alt_text: media.name,
          caption: media.name,
          description: media.name,
        });
      }
    } catch (error) {
      console.log(error);
    }
    try {
      let payload = {
        title: data.get("title"),
        content: data.get("preparation"),
        generated_slug: data.get("title"),
        featured_media: featured.id,
        author: localStorage.getItem("__wp").user_id,
        acf: {
          type,
          time: parseInt(data.get("time")),
          origin,
          ingredients: data.get("ingredients"),
        },
        status: "publish",
      };

      await axios
        .post(url, JSON.stringify(payload), { headers })
        .then((response) => {
          setId(response.id);
          setLoading(false);
          history.push("/");
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid
          item
          xs={6}
          component={Paper}
          elevation={6}
          rounded
          sx={{ margin: "0 auto" }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              my: 2,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1>Add Recipe</h1>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoComplete="title"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="ingredients"
              label="Ingredients"
              name="ingredients"
              autoComplete="ingredients"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="time"
              label="Preparation Time"
              name="time"
              autoComplete="time"
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="type">Type</InputLabel>
              <Select
                labelId="type"
                id="type"
                value={type}
                label="Type"
                onChange={handleType}
              >
                <MenuItem value={`veg`}>Veg</MenuItem>
                <MenuItem value={`non-veg`}>Non-veg</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel id="origin">Origin</InputLabel>
              <Select
                labelId="origin"
                id="origin"
                value={origin}
                label="Origin"
                onChange={handleOrigin}
              >
                <MenuItem value={`indian`}>Indian</MenuItem>
                <MenuItem value={`bangladeshi`}>Bangladeshi</MenuItem>
                <MenuItem value={`italian`}>Italian</MenuItem>
                <MenuItem value={`french`}>French</MenuItem>
                <MenuItem value={`chinese`}>Chinese</MenuItem>
                <MenuItem value={`japanese`}>Japanese</MenuItem>
                <MenuItem value={`korean`}>Korean</MenuItem>
                <MenuItem value={`mexican`}>Mexican</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="preparation"
              margin="normal"
              label="Preparation"
              name="preparation"
              multiline
              maxRows={4}
              fullWidth
            />
            <label htmlFor="icon-button-file">
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                name="feat_media"
                onChange={handleFile}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
            <p>{media ? media.name : ""}</p>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 5, mb: 2 }}
              disabled={loading}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
