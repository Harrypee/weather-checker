import moment from "moment";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: `background-color 200ms ${theme.transitions.easing.easeInOut}`,
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
  "&:last-child": {
    borderBottom: 0,
  },
}));

const SearchHistory = ({
  searchHistory = [],
  onClearSearchHistory,
  onRepeatSearch,
  onDeleteSearchHistory,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Search History
        </Typography>
        <Button size="small" onClick={onClearSearchHistory}>
          Clear
        </Button>
      </Stack>
      {searchHistory.length > 0 ? (
        <List dense disablePadding>
          {searchHistory
            .sort((a, b) => b.dateTime - a.dateTime)
            .map((record, index) => (
              <StyledListItem
                key={index}
                divider
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => onRepeatSearch(record)}>
                      <SearchRoundedIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteSearchHistory(record.id)}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText
                  secondary={moment.unix(record.dateTime).format("YYYY-MM-DD hh:mm A")}
                >
                  {record.name}, {record.country}
                </ListItemText>
              </StyledListItem>
            ))}
        </List>
      ) : (
        <Typography variant="body2" textAlign="center" color="gray">
          You have not search any location yet.
        </Typography>
      )}
    </Paper>
  );
};

export default SearchHistory;
