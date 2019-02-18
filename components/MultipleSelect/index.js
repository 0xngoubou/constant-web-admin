import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const styles = theme => ({
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing.unit / 4
  }
});

export default withStyles(styles)(props => {
  const { classes, data, value, onChange, inputId } = props;

  const handleChange = event => {
    const value = event.target.value;
    onChange && onChange(value);
  };

  return (
    <Select
      multiple
      value={value}
      onChange={handleChange}
      input={<Input id={inputId} fullWidth />}
      renderValue={selected => (
        <div className={classes.chips}>
          {selected.map(key => (
            <Chip key={key} label={data[key]} className={classes.chip} />
          ))}
        </div>
      )}
      MenuProps={MenuProps}
    >
      {Object.keys(data).map(key => (
        <MenuItem key={key} value={key}>
          {data[key]}
        </MenuItem>
      ))}
    </Select>
  );
});
