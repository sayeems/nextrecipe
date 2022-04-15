import {
  Container,
  Grid,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuIcon,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Stack,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const history = useRouter();
  const [localsession, setLocalsession] = useState();
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("__wp");
    setLocalsession(false);
    history.push("/");
  };

  useEffect(() => {
    const checkSession = () => {
      localStorage.getItem("__wp")
        ? setLocalsession(true)
        : setLocalsession(false);
    };
    return checkSession();
  });
  return (
    <Container maxWidth="lg">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <AppBar position="fixed">
            <Toolbar>
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <Link href="/">
                    <a>
                      <h3>RECIPE</h3>
                    </a>
                  </Link>
                </Grid>
                <Grid item xs={2}>
                  <Stack direction="row" spacing={2}>
                    {localsession ? (
                      <>
                        <Link href="/recipe">
                          <a>
                            <h5>Create</h5>
                          </a>
                        </Link>
                        <a href="#" onClick={handleLogout}>
                          <h5>Logout</h5>
                        </a>
                      </>
                    ) : (
                      <Link href="/login">
                        <a>
                          <h5>Login</h5>
                        </a>
                      </Link>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={12} sx={{ mt: "80px" }}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Layout;
