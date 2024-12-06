import { Box, Button, TextField } from "@mui/material";

interface InputProps {
  ticker: string;
  startDate: string;
  endDate: string;
  setTicker: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  onFetch: () => void;
}

const Input: React.FC<InputProps> = ({
  ticker,
  startDate,
  endDate,
  setTicker,
  setStartDate,
  setEndDate,
  onFetch,
}) => {
  return (
    <Box display="flex" flexDirection="row" gap={2}>
      <TextField
        required
        id="outlined-required"
        label="Ticker"
        placeholder="Enter stock ticker"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />
      <TextField
        required
        id="outlined-start-date"
        label="Start Date (YYYY-MM-DD)"
        placeholder="Enter start date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <TextField
        required
        id="outlined-end-date"
        label="End Date (YYYY-MM-DD)"
        placeholder="Enter end date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <Button variant="contained" onClick={onFetch}>
        Fetch
      </Button>
    </Box>
  );
};

export default Input;
