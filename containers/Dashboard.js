import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { inject } from "mobx-react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";

// icons
import RefreshIcon from "@material-ui/icons/Refresh";

import { AccountsService } from "../services";

const TYPE_ESCROW_ACCOUNT_BALANCE = "escrow_account_balance";
const TYPE_CUSTODIAL_ACCOUNT_BALANCE = "custodial_account_balance";

const styles = theme => ({
  title: {
    flexGrow: 1
  },
  primetrustGrow: {
    flex: 1
  },
  primetrustTableCellLabel: {
    paddingRight: "0 !important",
    width: "1px",
    whiteSpace: "nowrap",
    textTransform: "capitalize",
    fontWeight: "bold"
  }
});

@inject("store")
class DashboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      custodial: {
        id: "",
        name: "",
        balance: 0
      },
      escrow: {
        id: "",
        name: "",
        balance: 0
      }
    };
    this.service = new AccountsService();
  }

  componentDidMount() {
    this.service
      .custodialAccount()
      .then(async ({ status, data: custodial, error }) => {
        if (status === 1) {
          const {
            data: custodialBalance
          } = await this.service.custodialAccountBalance();
          console.log(custodialBalance);
          this.setState(state => ({
            custodial: {
              ...state.custodial,
              id: custodial["id"],
              name: custodial["attributes"]["name"],
              balance: custodialBalance
            }
          }));
        } else {
          alert("Can't load custodial account...");
        }
      });

    this.service
      .escrowAccount()
      .then(async ({ status, data: escrow, error }) => {
        if (status === 1) {
          const {
            data: escrowBalance
          } = await this.service.escrowAccountBalance();
          console.log("es", escrowBalance);
          this.setState(state => ({
            escrow: {
              ...state.escrow,
              id: escrow["id"],
              name: escrow["attributes"]["name"],
              balance: escrowBalance
            }
          }));
        } else {
          alert("Can't load escrow account...");
        }
      });
  }

  refresh = async type => {
    const { store } = this.props;
    store.ui.showLoading();
    switch (type) {
      case TYPE_CUSTODIAL_ACCOUNT_BALANCE: {
        console.log("custodial balance");
        const key = "custodial";
        this.setState(state => ({ [key]: { ...state[key], balance: 0 } }));
        const { data: balance } = await this.service.custodialAccountBalance();
        this.setState(state => ({ [key]: { ...state[key], balance } }));
        break;
      }
      case TYPE_ESCROW_ACCOUNT_BALANCE: {
        const key = "escrow";
        console.log("escrow balance");
        this.setState(
          state => ({ [key]: { ...state[key], balance: 0 } }),
          () => {
            console.log(this.state);
          }
        );
        const { data: balance } = await this.service.custodialAccountBalance();
        this.setState(state => ({ [key]: { ...state[key], balance } }));
        break;
      }
      default: {
        console.log("unknown");
      }
    }
    store.ui.hideLoading();
    return null;
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item lg={6} sm={12}>
          <Paper>
            <Toolbar>
              <Typography variant="h5">Account Custodial</Typography>
              <div className={classes.primetrustGrow} />
              <div>
                <IconButton
                  color="inherit"
                  onClick={this.refresh.bind(
                    this,
                    TYPE_CUSTODIAL_ACCOUNT_BALANCE
                  )}
                >
                  <RefreshIcon />
                </IconButton>
              </div>
            </Toolbar>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.primetrustTableCellLabel}>
                    ID
                  </TableCell>
                  <TableCell align="right">{this.state.custodial.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.primetrustTableCellLabel}>
                    Name
                  </TableCell>
                  <TableCell align="right">
                    {this.state.custodial.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.primetrustTableCellLabel}>
                    Total Cash
                  </TableCell>
                  <TableCell align="right">
                    ${this.state.custodial.balance}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item lg={6} sm={12}>
          <Paper>
            <Toolbar>
              <Typography variant="h5">Account Escrow</Typography>
              <div className={classes.primetrustGrow} />
              <div>
                <IconButton
                  color="inherit"
                  onClick={this.refresh.bind(this, TYPE_ESCROW_ACCOUNT_BALANCE)}
                >
                  <RefreshIcon />
                </IconButton>
              </div>
            </Toolbar>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.primetrustTableCellLabel}>
                    ID
                  </TableCell>
                  <TableCell align="right">{this.state.escrow.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.primetrustTableCellLabel}>
                    Name
                  </TableCell>
                  <TableCell align="right">{this.state.escrow.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.primetrustTableCellLabel}>
                    Total Cash
                  </TableCell>
                  <TableCell align="right">
                    ${this.state.escrow.balance}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

DashboardContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DashboardContainer);
