import { useEffect, useState } from "react";
import { toCelsius } from "./utils/conversion";
import SearchHistory from "./search-history";
import WeatherCard from "./weather-card";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

// Search history records are stored in local storage.
const initialSearchHistory = JSON.parse(localStorage.getItem("searchHistory"));

const initialFormValues = { city: "", country: "" };

// Form validation schema.
const schema = Yup.object().shape({
  city: Yup.string().required("This is required."),
  country: Yup.string().required("This is required."),
});

const App = () => {
  const [weather, setWeather] = useState(null);
  const [searchHistory, setSearchHistory] = useState(initialSearchHistory || []);
  const [errorNotice, setErrorNotice] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: schema,
    initialValues: initialFormValues,
    onSubmit: async values => {
      const query = Object.values(values).join(",");

      try {
        handleLocationSearch(query);
        formik.resetForm({ values: initialFormValues });
      } catch (error) {
        console.log(error);
      }
    },
  });

  /**
   * Check current location's coordinates when mounted.
   */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude.toFixed(2);
        const lon = position.coords.longitude.toFixed(2);

        const weather = await getWeatherApi(lat, lon);

        setWeather(weather);
      });
    }
  }, []);

  /**
   * Process or sanitize OpenWeather response data.
   */
  const processWeatherData = data => {
    return {
      id: data.id,
      name: data.name,
      country: data.sys.country,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      temperature: {
        min: toCelsius(data.main.temp_min),
        max: toCelsius(data.main.temp_max),
      },
      humidity: data.main.humidity,
      dateTime: data.dt,
      coord: data.coord,
    };
  };

  /**
   * Reusable API call which takes in coordinates as arguments
   */
  const getWeatherApi = async (lat, lon) => {
    // OpenWeather API key stored in dotenv file which can be retrieved conveniently.
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
    ).then(res => res.json());

    return processWeatherData(response);
  };

  const handleLocationSearch = async query => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
    ).then(res => res.json());

    // Show error notice when there's no result
    if (response.length === 0) {
      setErrorNotice("The location you searched for returns no result.");
      return;
    }

    const lat = response[0].lat.toFixed(2);
    const lon = response[0].lon.toFixed(2);

    const weather = await getWeatherApi(lat, lon);

    setWeather(weather);

    const isExistsInSearchHistory =
      searchHistory.findIndex(history => history.id === weather.id) !== -1;

    // Prevent add into search history if search result exists in search history list.
    if (!isExistsInSearchHistory) {
      const history = [...searchHistory, weather];

      setSearchHistory(history);

      localStorage.setItem("searchHistory", JSON.stringify(history));
    }

    if (errorNotice) {
      setErrorNotice("");
    }
  };

  /**
   * Separates from handleLocationSearch to prevent inserting repeated search into search history list.
   */
  const handleRepeatSearch = async record => {
    const { lat, lon } = record.coord;

    const weather = await getWeatherApi(lat, lon);

    setWeather(weather);
  };

  const handleDeleteSearchHistory = weatherId => {
    const result = searchHistory.filter(history => history.id !== weatherId);

    setSearchHistory(result);

    localStorage.setItem("searchHistory", JSON.stringify(result));
  };

  const handleClearSearchHistory = () => {
    setSearchHistory([]);

    localStorage.removeItem("searchHistory");
  };

  return (
    <Container maxWidth="md">
      <Box component="main" sx={{ py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            Today's Weather
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="City"
                  name="city"
                  size="small"
                  fullWidth
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  error={formik.errors.city ? true : false}
                  helperText={formik.errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Country"
                  name="country"
                  size="small"
                  fullWidth
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  error={formik.errors.country ? true : false}
                  helperText={formik.errors.country}
                />
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant="contained" onClick={formik.handleSubmit}>
                      Search
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" onClick={formik.handleReset}>
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
          {errorNotice && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorNotice}
            </Alert>
          )}
        </Box>
        {weather && <WeatherCard weather={weather} />}
        <SearchHistory
          searchHistory={searchHistory}
          onClearSearchHistory={handleClearSearchHistory}
          onRepeatSearch={handleRepeatSearch}
          onDeleteSearchHistory={handleDeleteSearchHistory}
        />
      </Box>
    </Container>
  );
};

export default App;
