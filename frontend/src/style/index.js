import { styled } from "@mui/material/styles";

export const Main = styled("main")(() => ({
  backgroundColor: "transparent",
  width: "100%",
  height: "100vh",
  padding: "20px"
}));

export const Section = styled("section")(() => ({}));

export const Image = styled("img")(() => ({}));

export const Space = styled("div")(() => ({
  width: "100%",
  height: "20px",
}));

export const Title = styled("h1")(() => ({
  fontSize: "1.4993rem",
  fontWeight: 600,
  letterSpacing: "0.18px",
}));

export const Description = styled("p")(() => ({
  fontWeight: 400,
  fontSize: "0.875rem",
  lineHeight: 1.429,
  letterSpacing: "0.15px",
}));
