import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { inject, observer } from "mobx-react";

const styles = theme => ({
  primetrustTableCellLabel: {
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
    width: "1px",
    whiteSpace: "nowrap",
    textTransform: "capitalize",
    fontWeight: "bold"
  },
  primetrustTableCellValue: {
    paddingLeft: "0 !important",
    paddingRight: "0 !important"
  }
});

@inject("store")
@observer
class DialogPrimetrustDetail extends React.Component {
  handleCloseDialog = () => {
    const { store } = this.props;
    store.ui.hidePrimetrustDialog();
  };

  render() {
    const { classes, store } = this.props;

    const data = store.ui.primetrustDialogData
      ? JSON.parse(store.ui.primetrustDialogData)
      : null;

    return (
      data !== null && (
        <Dialog
          open={store.ui.primetrustDialog}
          onClose={this.handleCloseDialog}
          aria-labelledby="form-dialog-title"
          maxWidth={"md"}
          fullWidth
        >
          <DialogTitle id="form-dialog-title">{data["type"]}</DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
                <TableRow key="id">
                  <TableCell className={classes.primetrustTableCellLabel}>
                    ID
                  </TableCell>
                  <TableCell
                    align="right"
                    className={classes.primetrustTableCellValue}
                  >
                    {data["id"]}
                  </TableCell>
                </TableRow>
                {Object.keys(data["attributes"]).map(key => (
                  <TableRow key={key}>
                    <TableCell className={classes.primetrustTableCellLabel}>
                      {key}
                    </TableCell>
                    <TableCell
                      align="right"
                      className={classes.primetrustTableCellValue}
                    >
                      {typeof data["attributes"][key] === "object"
                        ? JSON.stringify(data["attributes"][key])
                        : data["attributes"][key]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      )
    );
  }
}

DialogPrimetrustDetail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DialogPrimetrustDetail);
