import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CircularProgress from "@material-ui/core/CircularProgress";

// icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ContactsIcon from "@material-ui/icons/Contacts";
import RedoIcon from "@material-ui/icons/Redo";
import UndoIcon from "@material-ui/icons/Undo";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import PeopleIcon from "@material-ui/icons/People";

import { inject, observer } from "mobx-react";
import Link from "next/link";

// components
import DialogLoginForm from "../DialogLoginForm";
import DialogPrimetrustDetail from "../DialogPrimetrustDetail";

const drawerWidth = 240;

const routes = [
  { text: "Dashboard", href: "/", as: "/", icon: DashboardIcon },
  { text: "Profiles", href: "/profiles", as: "/profiles", icon: PeopleIcon }
];

const primetrustRoutes = [
  {
    text: "Account transfers",
    href: "/account-cash-transfers",
    as: "/account-cash-transfers",
    icon: ImportExportIcon
  },
  {
    text: "Contacts",
    href: "/contacts",
    as: "/contacts",
    icon: ContactsIcon
  },
  {
    text: "Contributions",
    href: "/contributions",
    as: "/contributions",
    icon: RedoIcon
  },
  {
    text: "Disbursements",
    href: "/disbursements",
    as: "/disbursements",
    icon: UndoIcon
  }
];

const styles = theme => ({
  "@global": {
    "*": {
      fontFamily: `"Roboto", "Helvetica", "Arial", "sans-serif"`
    },
    a: {
      textDecoration: "none",
      color: "inherit"
    }
  },
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto",
    paddingTop: theme.spacing.unit * 10.5,
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing.unit * 11.5
    }
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  },
  h5: {
    marginBottom: theme.spacing.unit * 2
  },
  loading: {
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "9999999",
    background: "rgba(0, 0, 0, 0.6)",
    width: "100%",
    height: "100%",
    display: "none",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff"
  }
});

@inject("store")
@observer
class Layout extends React.Component {
  state = {
    open: true
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleLogin = async ({ email, password }) => {
    const { store } = this.props;
    if (store) {
      const error = await store.auth.logIn(email, password);
      console.log("error", error);
      console.log(store.auth);
      if (error) {
        alert(error);
      }
    }
  };

  handleLogout = async () => {
    const { store } = this.props;
    if (store) {
      await store.auth.logOut();
    }
  };

  render() {
    const { classes, store } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.state.open && classes.appBarShift
          )}
        >
          <Toolbar
            disableGutters={!this.state.open}
            className={classes.toolbar}
          >
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h4"
              color="inherit"
              noWrap
              className={classes.title}
            >
              <Link as={"/"} href={"/"}>
                <a>Primetrust</a>
              </Link>
            </Typography>

            {store.auth.isAuthenticated && (
              <IconButton color="inherit" onClick={this.handleLogout}>
                <ExitToAppIcon />
              </IconButton>
            )}

            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            )
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {routes.map((item, idx) => (
              <Link key={idx} as={item.as} href={item.href}>
                <a>
                  <ListItem button>
                    <ListItemIcon>
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </a>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            {primetrustRoutes.map((item, idx) => (
              <Link key={idx} as={item.as} href={item.href}>
                <a>
                  <ListItem button>
                    <ListItemIcon>
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </a>
              </Link>
            ))}
          </List>
        </Drawer>
        <div className={classes.content}>
          {store.auth.isAuthenticated && this.props.children}
        </div>
        <DialogLoginForm onLogin={this.handleLogin} />
        <DialogPrimetrustDetail />
        <div
          className={`${classes.loading}`}
          style={{ display: store.ui.loading ? "flex" : "none" }}
        >
          <CircularProgress size={80} thickness={2} color="inherit" />
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Layout);
