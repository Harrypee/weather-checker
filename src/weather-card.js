import moment from "moment";
import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(() => ({
  borderBottom: 0,
  "&.MuiTableCell-head": {
    width: 100,
  },
}));

const WeatherCard = ({ weather }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="overline" fontWeight={700} sx={{ mb: 1 }}>
        {weather.name}, {weather.country}
      </Typography>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        {weather.condition}
      </Typography>
      <Table size="small">
        <TableBody>
          <TableRow>
            <StyledTableCell variant="head">Description:</StyledTableCell>
            <StyledTableCell>{weather.description}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell variant="head">Temperature:</StyledTableCell>
            <StyledTableCell>{`${weather.temperature.min}\u00B0C ~ ${weather.temperature.max}\u00B0C`}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell variant="head">Humidity:</StyledTableCell>
            <StyledTableCell>{weather.humidity}%</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell variant="head">Time:</StyledTableCell>
            <StyledTableCell>
              {moment.unix(weather.dateTime).format("YYYY-MM-DD hh:mm A")}
            </StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default WeatherCard;
