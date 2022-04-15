import axios from "axios";
import { Grid } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

export const getStaticPaths = async () => {
  const data = await axios
    .get("https://dev-wpsayeem.pantheonsite.io/wp-json/wp/v2/posts")
    .then((response) => response.data);

  const paths = data.slice(0, 2).map((dat) => {
    return {
      params: {
        id: dat.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await axios
    .get(
      `https://dev-wpsayeem.pantheonsite.io/wp-json/wp/v2/posts/${id}?_embed`
    )
    .then((response) => response.data);

  return {
    props: { post: data },
  };
};

const Details = ({ post }) => {
  const history = useRouter();
  if (history.isFallback) {
    return <h1>Loading...</h1>;
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <img
          src={post._embedded["wp:featuredmedia"][0].source_url}
          style={{ maxWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <h2>{post.title.rendered}</h2>
          </Grid>
          <Grid item xs={12}>
            <h3>Ingredients</h3>
            <ul>
              {post.acf.ingredients.split(",").map((item, index) => (
                <li key={`${index}`}>{item}</li>
              ))}
            </ul>
          </Grid>
          <Grid item xs={12}>
            <h3>Process</h3>
            <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Details;
