import {
  TextField,
  Box,
  Grid,
  Paper,
  Button,
  LinearProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  let history = useRouter();

  useEffect(() => {
    const checkLoginState = () => {
      const loginState = localStorage.getItem("__wp");
      if (loginState != null) {
        history.push("/");
      }
    };
    return checkLoginState();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    setError("");
    let username = data.get("username");
    let password = data.get("password");
    await axios
      .post("https://dev-wpsayeem.pantheonsite.io/wp-json/jwt-auth/v1/token", {
        username,
        password,
      })
      .then((response) => {
        localStorage.setItem("__wp", JSON.stringify(response.data));
        history.push("/");
      })
      .catch((error) => {
        setError("Incorrect username or password");
        setLoading(false);
      });
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
          sx={{ margin: "0 auto", position: "relative" }}
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
            <h1>Login</h1>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username/Email"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 0, mb: 2 }}
              disabled={loading}
            >
              Sign In
            </Button>
            <p style={{ color: "red" }}>{error ? error : ""}</p>
          </Box>
          <Box
            sx={{
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "hidden",
              borderRadius: "5px 5px 0px 0px",
            }}
          >
            {loading ? <LinearProgress /> : ""}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
