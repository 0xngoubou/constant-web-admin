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
import Button from "@material-ui/core/Button";
// icons
import RefreshIcon from "@material-ui/icons/Refresh";
import InfoIcon from "@material-ui/icons/Info";
// services
import { ContactsService } from "../services";

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
  },
  primetrustTableCellActions: {
    textAlign: "center !important",
    whiteSpace: "nowrap"
  },
  primetrustTableCellLabel: {
    paddingRight: "0 !important",
    width: "1px",
    whiteSpace: "nowrap",
    textTransform: "capitalize"
  },
  primetrustButtonRightIcon: {
    marginLeft: "8px"
  }
});

@inject("store")
@observer
class ContactsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoaded: 0
    };
    this.service = new ContactsService();
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
    this.setState(() => ({ isLoaded: 1 }));
    const { store } = this.props;
    store.ui.showLoading();
    const { status, data, error } = await this.service.list(
      store.contacts.page,
      store.contacts.size
    );
    store.ui.hideLoading();
    if (status !== 1) {
      alert(error);
    } else {
      if (store.contacts.total !== data.meta["resource-count"]) {
        store.contacts.setTotal(data.meta["resource-count"]);
      }
      this.setState(() => ({ data: data.data, isLoaded: 2 }));
    }
  };

  refresh = async () => {
    this.setState(() => ({ data: [], isLoaded: 0 }));
  };

  showDetail = async item => {
    const { store } = this.props;
    store.ui.showPrimetrustDialog(item);
  };

  showCIPCheck = async contactId => {
    const { store } = this.props;
    store.ui.showLoading();
    const { status, data } = await this.service.getCIPChecks(contactId);
    store.ui.hideLoading();
    if (status !== 1) {
      alert("Please try again later");
      return;
    }
    store.ui.showPrimetrustDialog(data);
  };

  handlePageChange = (evt, page) => {
    const { store } = this.props;
    store.contacts.setPage(page + 1);
    this.setState(() => ({ isLoaded: 0 }));
  };

  handleRowsPerPageChange = evt => {
    const { store } = this.props;
    store.contacts.setSize(evt.target.value);
    this.setState(() => ({ isLoaded: 0 }));
  };

  render() {
    const { classes, store } = this.props;
    return (
      <Paper>
        <Toolbar>
          <Typography variant="h5">Contacts</Typography>
          <div className={classes.primetrustGrow} />
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
        <Table className={classes.primetrustTable}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>KYC</TableCell>
              <TableCell
                padding="checkbox"
                className={classes.primetrustTableCellActions}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map((item, i) => (
              <TableRow key={i.toString()}>
                <TableCell>{item["attributes"]["name"]}</TableCell>
                <TableCell>{item["attributes"]["email"]}</TableCell>
                <TableCell>{item["attributes"]["date-of-birth"]}</TableCell>
                <TableCell>{item["attributes"]["tax-country"]}</TableCell>
                <TableCell>
                  {item["attributes"]["cip-cleared"] &&
                  item["attributes"]["aml-cleared"] ? (
                    <Button variant="contained" color="primary" disabled>
                      Passed
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.showCIPCheck.bind(this, item["id"])}
                    >
                      Failed
                      <InfoIcon className={classes.primetrustButtonRightIcon} />
                    </Button>
                  )}
                </TableCell>
                <TableCell
                  padding="checkbox"
                  className={classes.primetrustTableCellActions}
                >
                  <Button
                    key="info"
                    color="inherit"
                    variant="contained"
                    onClick={this.showDetail.bind(this, item)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                page={store.contacts.page - 1}
                rowsPerPage={store.contacts.size}
                count={store.contacts.total}
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

ContactsContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContactsContainer);
