import { useEffect, useState } from "react";
import axios from "axios";
import SeriesCard from "../components/SeriesCard";
import { Grid, Box, Typography, Skeleton } from "@mui/material";

export default function SeriesList() {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllSeries = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/series/all-series`);
        console.log("Series API response:", data?.data);
        setSeriesList(data?.data || []);
      } catch (err) {
        console.error("Failed to fetch series:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSeries();
  }, []);

  if (loading) return (
    <>
      <p className="text-center mt-10">Loading series...</p>
      <Grid container wrap="nowrap">
  {Array.from(new Array(3)).map((_, index) => (
    <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
      {/* Skeleton thumbnail */}
      <Skeleton variant="rectangular" width={210} height={118} />

      {/* Skeleton text placeholders */}
      <Box sx={{ pt: 0.5 }}>
        <Skeleton />
        <Skeleton width="60%" />
      </Box>
    </Box>
  ))}
</Grid>
    </>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Series</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {seriesList.map((series) => (
          <SeriesCard key={series._id} series={series} />
        ))}
      </div>
    </div>
  );
}