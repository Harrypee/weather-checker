import { useEffect, useState } from "react";
import { useFormik } from "formik";
import moment from "moment";
import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const initialSearchHistory = JSON.parse(localStorage.getItem("searchHistory"));

const App = () => {
  const [weather, setWeather] = useState(null);
  const [searchHistory, setSearchHistory] = useState(
    initialSearchHistory || []
  );
  const formik = useFormik({
    initialValues: {
      city: "",
      country: "",
    },
    onSubmit: async values => {
      const query = Object.values(values).join(",");

      handleLocationSearch(query);
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude.toFixed(2);
        const lon = position.coords.longitude.toFixed(2);

        const weather = await handleGetWeather(lat, lon);

        setWeather(weather);
      });
    }
  }, []);

  const processWeatherData = data => {
    return {
      name: data.name,
      country: data.sys.country,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      temperature: `${data.main.temp_min}\u00B0C ~ ${data.main.temp_max}\u00B0C`,
      humidity: data.main.humidity,
      dateTime: moment(data.dt * 1000).format("YYYY-MM-DD hh:mm A"),
    };
  };

  const handleGetWeather = async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
    ).then(res => res.json());

    return processWeatherData(response);
  };

  const handleLocationSearch = async query => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
    ).then(res => res.json());

    const lat = response[0].lat.toFixed(2);
    const lon = response[0].lon.toFixed(2);

    const weather = await handleGetWeather(lat, lon);

    setWeather(weather);

    const history = [...searchHistory, weather];

    setSearchHistory(history);

    localStorage.setItem("searchHistory", JSON.stringify(history));
  };

  return (
    <Container maxWidth="md">
      <Box component="main" sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Today's Weather
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                name="city"
                size="small"
                onChange={formik.handleChange}
              />
              <TextField
                label="Country"
                name="country"
                size="small"
                onChange={formik.handleChange}
              />
              <Button variant="contained" onClick={formik.handleSubmit}>
                Search
              </Button>
              <Button variant="outlined" onClick={formik.handleReset}>
                Clear
              </Button>
            </Stack>
          </form>
          {weather && (
            <Box>
              <Typography variant="body2">
                {weather.name}, {weather.country}
              </Typography>
              <Typography variant="h4">{weather.condition}</Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell variant="head">Description:</TableCell>
                    <TableCell>{weather.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Temperature:</TableCell>
                    <TableCell>{weather.temperature}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Humidity:</TableCell>
                    <TableCell>{weather.humidity}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Time:</TableCell>
                    <TableCell>{weather.dateTime}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Search History
            </Typography>
            <List>
              {searchHistory.map((record, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <IconButton>
                        <SearchRoundedIcon />
                      </IconButton>
                      <IconButton>
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemText secondary={record.dateTime}>
                    {record.name}, {record.country}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
