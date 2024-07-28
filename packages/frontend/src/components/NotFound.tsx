import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function NotFound() {
  return (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        paddingTop="2rem"
      >
        Sorry, page not found!
      </Typography>
    </Box>
  );
}
