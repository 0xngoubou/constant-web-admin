import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
//icons
import RefreshIcon from "@material-ui/icons/Refresh";

import { AccountCashTransfersService } from "../services";

const styles = theme => ({
  title: {
    flexGrow: 1
  },
  primetrustTable: {
    maxWidth: "100%",
    overflow: "auto"
  },
  primetrustGrow: {
    flexGrow: 1
  }
});

@inject("store")
@observer
class AccountCashTransfersContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoaded: 0
    };
    this.service = new AccountCashTransfersService();
  }

  componentDidMount() {
    if (this.state.isLoaded === 0) {
      this.loadData();
    }
  }

  componentDidUpdate() {
    if (this.state.isLoaded === 0) {
      this.loadData();
    }
  }

  loadData = async () => {
    const { store } = this.props;
    try {
      store.ui.showLoading();
      const { status, data, error } = await this.service.list(
        store.act.page,
        store.act.size
      );
      store.ui.hideLoading();
      if (status !== 1) {
        alert(error);
      } else {
        if (store.act.total !== data.meta["resource-count"]) {
          store.act.setTotal(data.meta["resource-count"]);
        }
        this.setState(() => ({ data: data.data, isLoaded: 2 }));
      }
    } catch (e) {
      alert(e.message);
      store.ui.hideLoading();
    }
  };

  refresh = async () => {
    this.setState(() => ({ data: [], isLoaded: 0 }));
  };

  handlePageChange = (evt, page) => {
    const { store } = this.props;
    store.act.setPage(page + 1);
    this.setState(() => ({ isLoaded: 0 }));
  };

  handleRowsPerPageChange = evt => {
    const { store } = this.props;
    store.act.setSize(evt.target.value);
    this.setState(() => ({ isLoaded: 0 }));
  };

  render() {
    const { classes, store } = this.props;
    return (
      <Paper>
        <Toolbar>
          <Typography variant="h5">Account internal transfers</Typography>
          <div className={`${classes.primetrustGrow}`} />
          <div>
            <IconButton
              key="refresh"
              color="inherit"
              onClick={this.refresh.bind(this)}
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </Toolbar>
        <Table className={`${classes.primetrustTable}`}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map((item, i) => (
              <TableRow key={i.toString()}>
                <TableCell>{item["attributes"]["created-at"]}</TableCell>
                <TableCell>
                  {item["relationships"]["from-account"]["links"][
                    "related"
                  ].replace("/v2/accounts/", "")}
                </TableCell>
                <TableCell>
                  {item["relationships"]["to-account"]["links"][
                    "related"
                  ].replace("/v2/accounts/", "")}
                </TableCell>
                <TableCell>${item["attributes"]["amount"]}</TableCell>
                <TableCell>{item["attributes"]["status"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                page={store.act.page - 1}
                rowsPerPage={store.act.size}
                count={store.act.total}
                onChangePage={this.handlePageChange}
                onChangeRowsPerPage={this.handleRowsPerPageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    );
  }
}

AccountCashTransfersContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AccountCashTransfersContainer);
