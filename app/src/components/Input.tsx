import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

interface InputProps {
  ticker: string;
  startDate: string;
  endDate: string;
  setTicker: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  onFetch: () => void;
  calculateDate: (offsetInDays: number) => string;
}



const Input: React.FC<InputProps> = ({
  ticker,
  startDate,
  endDate,
  setTicker,
  setStartDate,
  setEndDate,
  onFetch,
  calculateDate
}) => {
  const [selectedRange, setSelectedRange] = useState<string>("1D"); // Track selected button
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog state

  const handleQuickSelect = (rangeInDays: number, label: string) => {
    setStartDate(calculateDate(rangeInDays));
    setEndDate(calculateDate(0)); // Today
    setSelectedRange(label);
  };

  const handleCustomSelect = () => {
    setIsDialogOpen(true);
    setSelectedRange("Custom");
  };

  const handleDialogClose = (save: boolean) => {
    if (!save) {
      setIsDialogOpen(false);
      return;
    }
    // Custom dates are already set via inputs; just close dialog
    setIsDialogOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" flexDirection="row" gap={2} justifyContent="center">
        <TextField
          required
          id="outlined-required"
          label="Ticker"
          placeholder="Enter stock ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
        <Button variant="contained" onClick={onFetch}>
          Fetch
        </Button>
      </Box>
      <Box display="flex" flexDirection="row" gap={1} justifyContent="center">
        <Button
          variant={selectedRange === "1D" ? "contained" : "outlined"}
          onClick={() => handleQuickSelect(1, "1D")}
        >
          1D
        </Button>
        <Button
          variant={selectedRange === "1W" ? "contained" : "outlined"}
          onClick={() => handleQuickSelect(7, "1W")}
        >
          1W
        </Button>
        <Button
          variant={selectedRange === "1M" ? "contained" : "outlined"}
          onClick={() => handleQuickSelect(30, "1M")}
        >
          1M
        </Button>
        <Button
          variant={selectedRange === "3M" ? "contained" : "outlined"}
          onClick={() => handleQuickSelect(90, "3M")}
        >
          3M
        </Button>
        <Button
          variant={selectedRange === "6M" ? "contained" : "outlined"}
          onClick={() => handleQuickSelect(180, "6M")}
        >
          6M
        </Button>
        <Button
          variant={selectedRange === "1Y" ? "contained" : "outlined"}
          onClick={() => handleQuickSelect(365, "1Y")}
        >
          1Y
        </Button>
        <Button
          variant={selectedRange === "2Y" ? "contained" : "outlined"}
          onClick={() => handleQuickSelect(730, "2Y")}
        >
          2Y
        </Button>
        <Button
          variant={selectedRange === "Custom" ? "contained" : "outlined"}
          onClick={handleCustomSelect}
        >
          Custom
        </Button>
      </Box>
      <Dialog open={isDialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Custom Date Range</DialogTitle>
        <DialogContent>
          <TextField
            label="Start Date (YYYY-MM-DD)"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="dense"
          />
          <TextField
            label="End Date (YYYY-MM-DD)"
            type="date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
          <Button onClick={() => handleDialogClose(true)} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Input;
