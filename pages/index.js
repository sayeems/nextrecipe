import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import {
  NoMeals,
  Restaurant,
  AccessTimeFilled,
  Public,
  DinnerDining,
} from "@mui/icons-material";

export const getServerSideProps = async () => {
  const data = await axios
    .get("https://dev-wpsayeem.pantheonsite.io/wp-json/wp/v2/posts?_embed")
    .then((response) => response.data);

  return {
    props: { posts: data },
  };
};

export default function Home({ posts }) {
  const [value, setValue] = useState(1);
  const [recipe, setRecipe] = useState(posts);
  const handleVeg = () => {
    const filtered = posts.filter((item) => {
      return item.acf.type != "non-veg";
    });
    setRecipe(filtered);
  };
  const handleAll = () => {
    setRecipe(posts);
  };
  const handleNonVeg = () => {
    const filtered = posts.filter((item) => {
      return item.acf.type != "veg";
    });
    setRecipe(filtered);
  };
  // console.log(posts);
  return (
    <Grid container spacing={2}>
      {recipe.map((post) => (
        <Grid item md={3} sm={6} key={`post-${post.id}`}>
          <Card sx={{ position: "relative" }}>
            <CardHeader
              sx={{ backgroundColor: "#f2f2f2" }}
              avatar={<Avatar src={post._embedded.author[0].avatar_urls[96]} />}
              title={post.title.rendered}
              subheader={post.modified}
            ></CardHeader>
            <Link href={`/${post.id}`}>
              <a>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    post._embedded["wp:featuredmedia"] !== undefined
                      ? post._embedded["wp:featuredmedia"][0].source_url
                      : "https://via.placeholder.com/200"
                  }
                />
              </a>
            </Link>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                backgroundImage: "linear-gradient(transparent, black)",
                padding: 1,
              }}
            >
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<AccessTimeFilled />}
                  color="success"
                  size="small"
                  label={post.acf.time}
                />
                <Chip
                  color="success"
                  icon={<Public />}
                  size="small"
                  label={post.acf.origin}
                />
                <Chip
                  icon={post.acf.type == "veg" ? <Restaurant /> : <NoMeals />}
                  color="success"
                  size="small"
                  label={post.acf.type}
                />
              </Stack>
            </Box>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Box
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            sx={{ backgroundColor: "#f2f2f2", borderTop: "3px solid orange" }}
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              label="VEG"
              icon={<NoMeals />}
              onClick={handleVeg}
            />
            <BottomNavigationAction
              label="EVERYTHING"
              icon={<DinnerDining />}
              onClick={handleAll}
            />
            <BottomNavigationAction
              label="NON-VEG"
              icon={<Restaurant />}
              onClick={handleNonVeg}
            />
          </BottomNavigation>
        </Box>
      </Grid>
    </Grid>
  );
}
