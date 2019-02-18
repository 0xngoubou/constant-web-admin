import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

// icons
import RefreshIcon from "@material-ui/icons/Refresh";
import FilterListIcon from "@material-ui/icons/FilterList";
import BackIcon from "@material-ui/icons/ArrowBack";
// components
import MultipleSelect from "../components/MultipleSelect";
// services
import { ProfilesService, ContactsService } from "../services";
import {
  VERIFIED_LEVEL,
  VERIFIED_LEVEL_NEW,
  VERIFIED_LEVEL_EMAIL,
  VERIFIED_LEVEL_SUBMITTED,
  VERIFIED_LEVEL_PENDING,
  VERIFIED_LEVEL_VERIFYING,
  VERIFIED_LEVEL_REJECTED,
  VERIFIED_LEVEL_PRIMETRUST
} from "../constants";
import { DialogTitle } from "@material-ui/core";

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
  },
  primetrustActionButton: {
    "&:first-item": {
      marginLeft: 0
    },
    marginLeft: "8px"
  },
  verifiedLevel: {
    textTransform: "uppercase",
    minWidth: "100px"
  },
  dialogActionsRoot: {
    padding: `0 ${theme.spacing.unit * 3}px 0`,
    margin: `${theme.spacing.unit * 1.5}px 0`
  },
  dialogActionsButton: {
    margin: 0
  }
});

@inject("store")
@observer
class ProfilesContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoaded: 0,
      detail: null,
      filter: false
    };
    this.service = new ProfilesService();
    this.contactService = new ContactsService();
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
      store.profiles.verifiedLevels,
      store.profiles.keywords,
      store.profiles.page,
      store.profiles.size
    );
    store.ui.hideLoading();
    if (status !== 1) {
      alert(error);
    } else {
      if (store.profiles.total !== data.count) {
        store.profiles.setTotal(data.count);
      }
      this.setState(() => ({ data: data.data, isLoaded: 2 }));
    }
  };

  refresh = async () => {
    this.setState(() => ({ data: [], isLoaded: 0 }));
  };

  showCIPCheck = async contactId => {
    const { store } = this.props;
    store.ui.showLoading();
    const { status, data } = await this.contactService.getCIPChecks(contactId);
    store.ui.hideLoading();
    if (status !== 1) {
      alert("Please try again later");
      return;
    }
    store.ui.showPrimetrustDialog(data);
  };

  showContact = async contactId => {
    const { store } = this.props;
    store.ui.showLoading();
    const { status, data } = await this.contactService.detail(contactId);
    store.ui.hideLoading();
    if (status !== 1) {
      alert("Please try again later");
      return;
    }
    store.ui.showPrimetrustDialog(data);
  };

  submit = async id => {
    const { store } = this.props;
    store.ui.showLoading();
    const { status, data, error } = await this.service.submit(id);
    if (status !== 1) {
      if (error) {
        alert(error);
      }
    } else {
      this.setState(state => ({
        data: state.data.map(item => (item.ID === data.ID ? data : item))
      }));
    }
    store.ui.hideLoading();
  };

  discard = async id => {
    const { store } = this.props;
    store.ui.showLoading();
    const { status, data, error } = await this.service.discard(id);
    if (status !== 1) {
      if (error) {
        alert(error);
      }
    } else {
      this.setState(state => ({
        data: state.data.map(item => (item.ID === data.ID ? data : item))
      }));
    }
    store.ui.hideLoading();
  };

  showDetails = async item => {
    this.setState(() => ({ detail: item }));
  };

  closeDetails = () => {
    this.setState(() => ({ detail: null }));
  };

  handlePageChange = (evt, page) => {
    const { store } = this.props;
    store.profiles.setPage(page + 1);
    this.setState(() => ({ isLoaded: 0 }));
  };

  handleRowsPerPageChange = evt => {
    const { store } = this.props;
    store.profiles.setSize(evt.target.value);
    this.setState(() => ({ isLoaded: 0 }));
  };

  handleOpenFilter = () => {
    this.setState(() => ({ filter: true }));
  };

  handleCloseFilter = () => {
    console.log(this.state);
    this.setState(() => ({ filter: false }), this.loadData);
  };

  handleStatusChange = value => {
    const { store } = this.props;
    store.profiles.setVerifiedLevels(value);
  };

  handleKeywordsChange = evt => {
    const { store } = this.props;
    const value = evt.target.value;
    store.profiles.setKeywords(value);
  };

  renderActions = (verifiedLevel, item) => {
    const { classes } = this.props;
    switch (verifiedLevel) {
      case VERIFIED_LEVEL_SUBMITTED: {
        return (
          <React.Fragment>
            <Button
              key="create_contact"
              size="small"
              color="primary"
              variant="contained"
              className={classes.primetrustActionButton}
              onClick={this.submit.bind(this, item.ID)}
            >
              {item.PrimetrustContactID !== ""
                ? "Update Contact"
                : "Create Contact"}
            </Button>
            <Button
              key="discard"
              size="small"
              color="primary"
              variant="contained"
              className={classes.primetrustActionButton}
              onClick={this.discard.bind(this, item.ID)}
            >
              Discard
            </Button>
          </React.Fragment>
        );
      }
      case VERIFIED_LEVEL_VERIFYING: {
        return (
          <React.Fragment>
            <Button
              key="create_contact"
              size="small"
              color="primary"
              variant="contained"
              className={classes.primetrustActionButton}
              onClick={this.showContact.bind(this, item.PrimetrustContactID)}
            >
              Contact
            </Button>
            <Button
              key="cip_checks"
              size="small"
              color="primary"
              variant="contained"
              className={classes.primetrustActionButton}
              onClick={this.showCIPCheck.bind(this, item.PrimetrustContactID)}
            >
              CIP Checks
            </Button>
          </React.Fragment>
        );
      }
      case VERIFIED_LEVEL_REJECTED: {
        return (
          <React.Fragment>
            <Button
              key="contact"
              size="small"
              color="primary"
              variant="contained"
              className={classes.primetrustActionButton}
              onClick={this.showContact.bind(this, item.PrimetrustContactID)}
            >
              Contact
            </Button>
            <Button
              key="cip_checks"
              size="small"
              color="primary"
              variant="contained"
              className={classes.primetrustActionButton}
              onClick={this.showCIPCheck.bind(this, item.PrimetrustContactID)}
            >
              CIP Checks
            </Button>
            <Button
              key="discard"
              size="small"
              color="primary"
              variant="contained"
              className={classes.primetrustActionButton}
              onClick={this.discard.bind(this, item.ID)}
            >
              Discard
            </Button>
          </React.Fragment>
        );
      }
      case VERIFIED_LEVEL_PRIMETRUST: {
        return (
          <React.Fragment>
            <Button
              key="create_contact"
              size="small"
              color="primary"
              variant="contained"
              className={classes.primetrustActionButton}
              onClick={this.showContact.bind(this, item.PrimetrustContactID)}
            >
              Contact
            </Button>
            <Button
              key="show_cip_check"
              size="small"
              color="primary"
              variant="contained"
              className={classes.primetrustActionButton}
              onClick={this.showCIPCheck.bind(this, item.PrimetrustContactID)}
            >
              CIP Checks
            </Button>
          </React.Fragment>
        );
      }
    }
  };

  renderUserKey = key => {
    const map = {
      FullName: "Fullname",
      Gender: "Gender",
      DOB: "DOB",
      PhoneNumber: "Phone number",
      TaxCountry: "Tax country",
      TaxIDNumber: "Tax id number",
      TaxImage: "Tax image",
      AddressStreet1: "Street1",
      AddressStreet2: "Street2",
      AddressRegion: "State / region",
      AddressCity: "City",
      AddressPostalCode: "Postal code",
      AddressCountry: "Country"
    };
    return map[key] ? map[key] : key;
  };

  renderUserValue = (key, item) => {
    if (key === "TaxImage") {
      return <img style={{ maxHeight: "100px" }} src={item[key]} />;
    }
    if (key === "Gender") {
      return item[key] === 1 ? "Male" : "Female";
    }
    return item[key];
  };

  render() {
    const { classes, store } = this.props;

    if (this.state.detail !== null) {
      return (
        <Paper>
          <Toolbar>
            <Typography variant="h5">Details</Typography>
            <div className={classes.primetrustGrow} />
            <div>
              <IconButton
                key="back"
                color="inherit"
                onClick={this.closeDetails}
              >
                <BackIcon />
              </IconButton>
            </div>
          </Toolbar>
          <Grid container spacing={24}>
            <Grid item md={6} sm={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography variant="h6">Profile</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    "FullName",
                    "Gender",
                    "DOB",
                    "PhoneNumber",
                    "TaxCountry",
                    "TaxIDNumber",
                    "TaxImage"
                  ].map(key => (
                    <TableRow key={key}>
                      <TableCell className={classes.primetrustTableCellLabel}>
                        {this.renderUserKey(key)}
                      </TableCell>
                      <TableCell align="right">
                        {this.renderUserValue(key, this.state.detail)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item md={6} sm={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="h6">Address</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    "AddressStreet1",
                    "AddressStreet2",
                    "AddressRegion",
                    "AddressCity",
                    "AddressPostalCode",
                    "AddressCountry"
                  ].map(key => (
                    <TableRow key={key}>
                      <TableCell className={classes.primetrustTableCellLabel}>
                        {this.renderUserKey(key)}
                      </TableCell>
                      <TableCell align="right">
                        {this.renderUserValue(key, this.state.detail)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Paper>
      );
    }
    return (
      <Paper>
        <Toolbar>
          <Typography variant="h5">Profiles</Typography>
          <div className={classes.primetrustGrow} />
          <div>
            <IconButton
              key="filter"
              color="inherit"
              onClick={this.handleOpenFilter}
            >
              <FilterListIcon />
            </IconButton>
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
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
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
                <TableCell>{item.FullName}</TableCell>
                <TableCell>{item.Email}</TableCell>
                <TableCell>
                  <Chip
                    label={VERIFIED_LEVEL[item.VerifiedLevel]}
                    variant="outlined"
                    color="primary"
                    className={classes.verifiedLevel}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    key="info"
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={this.showDetails.bind(this, item)}
                  >
                    Details
                  </Button>
                </TableCell>
                <TableCell
                  padding="checkbox"
                  className={classes.primetrustTableCellActions}
                >
                  {this.renderActions(item.VerifiedLevel, item)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                page={store.profiles.page - 1}
                rowsPerPage={store.profiles.size}
                count={store.profiles.total}
                onChangePage={this.handlePageChange}
                onChangeRowsPerPage={this.handleRowsPerPageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>

        <Dialog
          maxWidth="md"
          fullWidth={true}
          open={this.state.filter}
          onClose={this.handleCloseFilter}
        >
          <DialogTitle>Filter</DialogTitle>
          <DialogContent>
            <Grid container spacing={24}>
              <Grid item sm={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="status">Status</InputLabel>
                  <MultipleSelect
                    inputId="status"
                    data={VERIFIED_LEVEL}
                    value={
                      store.profiles.verifiedLevels.length
                        ? store.profiles.verifiedLevels
                        : []
                    }
                    onChange={this.handleStatusChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12}>
                <FormControl fullWidth>
                  <TextField
                    label="Keywords"
                    fullWidth
                    value={store.profiles.keywords}
                    onChange={this.handleKeywordsChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions classes={{ root: classes.dialogActionsRoot }}>
            <Button
              className={classes.dialogActionsButton}
              onClick={this.handleCloseFilter}
              color="primary"
              variant="outlined"
            >
              Filter
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

ProfilesContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfilesContainer);
