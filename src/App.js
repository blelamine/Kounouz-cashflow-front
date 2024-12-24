import GearIcon from "@rsuite/icons/Gear";
import PageNextIcon from "@rsuite/icons/PageNext";
import PagePreviousIcon from "@rsuite/icons/PagePrevious";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Content,
  Dropdown,
  Header,
  Nav,
  Navbar,
  Sidebar,
  Sidenav,
} from "rsuite";

import { BsCashCoin, BsMenuButton } from "react-icons/bs";
import { HiOutlineUser, HiOutlineUserGroup } from "react-icons/hi";
import { Link, Route, Switch } from "react-router-dom";
import "./App.scss";
import { GrMenu } from "react-icons/gr";

import PageIcon from "@rsuite/icons/Page";
import MenuIcon from "@rsuite/icons/Menu";
import {
  HiOutlineChartPie,
  HiOutlineLibrary,
  HiOutlineServer,
  HiOutlineTicket,
} from "react-icons/hi";
import { useRecoilState, useSetRecoilState } from "recoil";
import "../node_modules/react-vis/dist/style.css";
import { APi } from "./Api";
import { agencyAtoms } from "./Atoms/agencies.atom";
import { agencyAtom } from "./Atoms/agency.atom";
import { isLogged } from "./Atoms/auth.atom";
import { CCAsAtom } from "./Atoms/cca.atom";
import { CurrencyAtom } from "./Atoms/currency.atom";
import { ExrciceAtom } from "./Atoms/exercice.atom";
import { PreferenceAtom } from "./Atoms/preference.atom";
import { respresentatAtom } from "./Atoms/representatives.atom";
import { TaxAtom } from "./Atoms/taxes.atom";
import { userAtom } from "./Atoms/user.atom";
import Login from "./Screens/Auth/login";
import Check from "./Screens/Check";
import CheckoutSummary from "./Screens/CheckoutSummary";
import Payment from "./Screens/Payment";
import ServiceTypes from "./Screens/ServiceType";
import CCA from "./Screens/Tiers/CCA";
import Client from "./Screens/Tiers/Client";
import Representative from "./Screens/Tiers/Representative";
import Transactions from "./Screens/Transactions";
import Bank from "./Screens/Treasory/Bank";
import Checkout from "./Screens/Treasory/Checkout";
import NotificationsList from "./Components/NotificationsList";
import { requestNotificationPermission } from "./notificationPermission";
import { IconContext } from "react-icons";

const iconStyles = {
  width: 56,
  height: 56,
  padding: 18,
  lineHeight: "56px",
  textAlign: "center",
};

const App = (props) => {
  const setexercices = useSetRecoilState(ExrciceAtom);

  const [expand, setExpand] = useState(false);
  const [loaded, setloaded] = useState(false);
  const [active, setactive] = useState(1);
  const [logged, setlogged] = useRecoilState(isLogged);
  const [pref, setpref] = useRecoilState(PreferenceAtom);
  const [user, setuser] = useRecoilState(userAtom);
  const setcurrencies = useSetRecoilState(CurrencyAtom);
  const setRepresentatives = useSetRecoilState(respresentatAtom);
  const setAgency = useSetRecoilState(agencyAtom);
  const setccas = useSetRecoilState(CCAsAtom);
  const [pageTitle, setpageTitle] = useState("Transactions Caisses");
  const location = useLocation();
  const [agencies, setagencies] = useRecoilState(agencyAtoms);
  const [taxes, settaxes] = useRecoilState(TaxAtom);
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  const fetchAgencies = () => {
    APi.createAPIEndpoint(APi.ENDPOINTS.Agency + "/getAll", {})
      .fetchAll()
      .then((res) => {
        setagencies(res.data);
      })
      .catch((e) => console.log(e.Message));
  };
  const fetchTaxes = () => {
    APi.createAPIEndpoint(APi.ENDPOINTS.Tax + "/getAll", {})
      .fetchAll()
      .then((res) => {
        settaxes(res.data);
      })
      .catch((e) => console.log(e.Message));
  };
  useEffect(() => {
    APi.createAPIEndpoint(APi.ENDPOINTS.CCA + "/getAll", {})
      .fetchAll()
      .then((res) => {
        setccas(res.data);
      })
      .catch((e) => console.log(e.Message));
    fetchAgencies();
    fetchTaxes();
    APi.createAPIEndpoint(APi.ENDPOINTS.Currency, { page: 1, take: 1000 })
      .fetchAll()
      .then((res) => setcurrencies(res.data.data));
    APi.createAPIEndpoint(APi.ENDPOINTS.Representative, { page: 1, take: 1000 })
      .fetchAll()
      .then((res) =>
        setRepresentatives(
          res.data.data.map((el) => ({
            id: el.id,
            name: el.firstName + " " + el.lastName,
          }))
        )
      );
    let log = true;
    if (
      !localStorage.getItem("auth") ||
      !JSON.parse(localStorage.getItem("auth")).token
    ) {
      log = false;
    } else {
    }
    setlogged(log);
    setuser(JSON.parse(localStorage.getItem("auth")));
    setTimeout(() => {
      setloaded(true);
      setpageTitle(routes[location.pathname]);
    }, 1000);
  }, [logged]);
  useEffect(() => {
    setExpand(false);
  }, [pageTitle]);

  useEffect(() => {
    let _pref = localStorage.getItem("pref");
    if (_pref) setpref(JSON.parse(_pref));
  }, []);
  const AuthGard = (Screen) => (logged ? Screen : <Login />);
  return (
    <div className="app">
      <NotificationsList />

      <Container>
        {logged && (
          <Sidebar className={"app-sidebar " + (expand ? "show" : "")}>
            <Sidenav.Header>
              <div className="app-sidebar-header">
                <div>
                  <strong>
                    <BsCashCoin></BsCashCoin>
                  </strong>
                  <b
                    style={{
                      marginLeft: 12,
                      fontSize: "large",
                      textTransform: "uppercase",
                    }}
                  >
                    cashflow
                  </b>{" "}
                </div>{" "}
                <button
                  className="close_menu_btn"
                  onClick={(e) => setExpand((prev) => !prev)}
                >
                  x
                </button>
              </div>
            </Sidenav.Header>
            <Sidenav defaultOpenKeys={["1"]} appearance="subtle">
              <Sidenav.Body>
                <Nav>
                  {user && !user.checkoutId ? (
                    <>
                      <Nav.Item
                        eventKey="aa2"
                        onClick={() => {
                          setactive("aa2");
                          setpageTitle("Clients B2B");
                        }}
                        active={active == "aa2"}
                      >
                        <b>
                          <HiOutlineUserGroup />
                        </b>{" "}
                        <Link className={"side_link "} to="/clients">
                          Clients B2B
                        </Link>
                      </Nav.Item>
                      <Nav.Item
                        eventKey="4-4"
                        onClick={() => {
                          setactive("4-4");
                          setpageTitle("Comptes Superviseurs");
                        }}
                        active={active == "4-4"}
                      >
                        {" "}
                        <b>
                          <HiOutlineUser />
                        </b>{" "}
                        <Link className={"side_link "} to="/tiers/cca">
                          Comptes Superviseurs
                        </Link>
                      </Nav.Item>
                      <Nav.Item
                        eventKey="Représentants"
                        onClick={() => {
                          setactive("Représentants");
                          setpageTitle("Représentants");
                        }}
                        active={active == "Représentants"}
                      >
                        {" "}
                        <b>
                          <HiOutlineUser />
                        </b>{" "}
                        <Link className={"side_link "} to="/representatives">
                          Représentants
                        </Link>
                      </Nav.Item>
                      <hr></hr>
                    </>
                  ) : (
                    ""
                  )}
                  {/* <Nav.Item
                    icon={<PageIcon />}
                    eventKey="1dzz1"
                    onClick={() => {
                      setactive("1dzz1");
                      setpageTitle("Exercices de comptabilité");
                    }}
                    active={active == "1dzz1"}
                  >
                    <Link className={"side_link "} to="/exercices">
                      Exercices de comptabilité
                    </Link>
                  </Nav.Item> */}
                  <Nav.Item
                    eventKey="5"
                    onClick={() => {
                      setactive("5");
                      setpageTitle("Gestion des chéques");
                    }}
                    active={active == "5"}
                  >
                    {" "}
                    <b>
                      <HiOutlineTicket />
                    </b>{" "}
                    <Link className={"side_link "} to="/checks">
                      Gestion des chèques
                    </Link>
                  </Nav.Item>
                  <hr></hr>
                  {/* <Nav.Item
                    eventKey="10"
                    icon={
                      <span className="side-span">
                        <PageIcon />
                      </span>
                    }
                    onClick={() => {
                      setactive("10");
                      setpageTitle(" Gestion des recouvrements");
                    }}
                    active={active == "10"}
                  >
                    <Link className={"side_link "} to="/payments">
                      Gestion des recouvrements
                    </Link>
                  </Nav.Item> */}
                  {user && !user.checkoutId ? (
                    <>
                      {" "}
                      <Nav.Item
                        eventKey="10"
                        onClick={() => {
                          setactive("Banques");
                          setpageTitle("Banques");
                        }}
                        active={active == "Banques"}
                      >
                        <b>
                          <HiOutlineLibrary />
                        </b>{" "}
                        <Link className={"side_link "} to="/treasory/banks">
                          Banques
                        </Link>
                      </Nav.Item>
                      <Nav.Item
                        eventKey="Caisses"
                        onClick={() => {
                          setactive("Caisses");
                          setpageTitle("Caisses");
                        }}
                        active={active == "Caisses"}
                      >
                        {" "}
                        <b>
                          <HiOutlineServer />
                        </b>{" "}
                        <Link className={"side_link "} to="/treasory/checkouts">
                          Caisses
                        </Link>
                      </Nav.Item>
                    </>
                  ) : (
                    ""
                  )}
                  <Nav.Item
                    eventKey="Transactions Caisses "
                    onClick={() => {
                      setactive("Transactions Caisses");
                      setpageTitle(" Transactions Caisses ");
                    }}
                    active={active == "Transactions Caisses "}
                  >
                    <b>
                      <PageIcon />
                    </b>{" "}
                    <Link className={"side_link "} to="/treasory/transactions">
                      Transactions Caisses
                    </Link>
                  </Nav.Item>
                  {user && !user.checkoutId ? (
                    <>
                      {" "}
                      <Nav.Item
                        eventKey="CheckoutSummary"
                        onClick={() => {
                          setactive("CheckoutSummary");
                          setpageTitle("Recap. Caisses");
                        }}
                        active={active == "CheckoutSummary"}
                      >
                        <b>
                          <HiOutlineChartPie />
                        </b>{" "}
                        <Link
                          className={"side_link "}
                          to="/treasory/checkout_summary"
                        >
                          Recap. Caisses
                        </Link>
                      </Nav.Item>{" "}
                    </>
                  ) : (
                    ""
                  )}
                  {/* <Dropdown
                    eventKey="6"
                    trigger="hover"
                    title="Trésorerie"
                    icon={
                      <span className="side-span"></span>
                    }
                    placement="rightStart"
                  >
                    <Dropdown.Item
                      eventKey="6-1"
                      onClick={() => {
                        setactive("6-1");
                        setpageTitle("Banques");
                      }}
                      active={active == "6-1"}
                    >
                      <Link className={"side_link "} to="/treasory/banks">
                        Banques
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="6-2"
                      onClick={() => {
                        setactive("6-2");
                        setpageTitle(" Caisses");
                      }}
                      active={active == "6-2"}
                    >
                      <Link className={"side_link "} to="/treasory/checkouts">
                        Caisses
                      </Link>
                    </Dropdown.Item>
                  </Dropdown> */}

                  {/* <Nav.Item
                    icon={<GearIcon />}
                    eventKey="1zz1"
                    onClick={() => {
                      setactive("1zz1");
                      setpageTitle("Préférences");
                    }}
                    active={active == "1zz1"}
                  >
                    <Link className={"side_link "} to="/preferences">
                      Préférences
                    </Link>
                  </Nav.Item> */}
                  {/* <hr></hr>
                  <Nav.Item
                    icon={<GearIcon />}
                    eventKey="Types des services"
                    onClick={() => {
                      setactive("Types des services");
                      setpageTitle("Types des services");
                    }}
                    active={active == "Types des services"}
                  >
                    <Link className={"side_link "} to="/service_type">
                      Types des services
                    </Link>
                  </Nav.Item> */}
                </Nav>
              </Sidenav.Body>
            </Sidenav>
            {/* <NavToggle expand={expand} onChange={() => setExpand(!expand)} /> */}
          </Sidebar>
        )}

        <Container className={"hole-container"}>
          {logged && (
            <Header className="page-header">
              <h4>{pageTitle}</h4>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <button
                  className="menu_btn"
                  onClick={(e) => setExpand((prev) => !prev)}
                  style={{
                    color: "#fff",
                    fontSize: "30px",
                    marginTop: "-12px",
                  }}
                >
                  <MenuIcon />
                </button>
                <Nav>
                  <Dropdown
                    placement="bottomEnd"
                    trigger="click"
                    icon={<GearIcon size="3em" />}
                    renderTitle={(children) => {
                      return <GearIcon style={iconStyles} />;
                    }}
                  >
                    {/* <Dropdown.Item>Help</Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item> */}
                    <Dropdown.Item
                      onClick={() => {
                        localStorage.removeItem("auth");
                        setlogged(false);
                      }}
                    >
                      Sign out
                    </Dropdown.Item>
                  </Dropdown>
                </Nav>
              </div>
            </Header>
          )}

          <Content className={"app-content " + (!logged ? "" : "logged")}>
            {user && !user.checkoutId ? (
              <Switch>
                {" "}
                <Route
                  path="/clients"
                  render={(props) => AuthGard(<Client {...props} />)}
                />
                <Route
                  path="/tiers/cca"
                  render={(props) => AuthGard(<CCA {...props} />)}
                />
                <Route
                  path="/representatives"
                  render={(props) => AuthGard(<Representative {...props} />)}
                />
                <Route
                  path="/payments"
                  render={(props) => AuthGard(<Payment {...props} />)}
                />
                <Route
                  path="/treasory/banks"
                  render={(props) => AuthGard(<Bank {...props} />)}
                />
                <Route
                  path="/treasory/checkouts"
                  render={(props) => AuthGard(<Checkout {...props} />)}
                />{" "}
                <Route
                  path="/treasory/checkout_summary"
                  render={(props) => AuthGard(<CheckoutSummary {...props} />)}
                />{" "}
                <Route
                  path="/service_type"
                  render={(props) => AuthGard(<ServiceTypes {...props} />)}
                />
                <Route
                  path="/checks"
                  render={(props) => AuthGard(<Check {...props} />)}
                />
                <Route
                  path="/treasory/transactions"
                  render={(props) => AuthGard(<Transactions {...props} />)}
                />{" "}
                <Route
                  path="/*"
                  render={(props) => AuthGard(<Transactions {...props} />)}
                />
              </Switch>
            ) : (
              <Switch>
                <Route
                  path="/checks"
                  render={(props) => AuthGard(<Check {...props} />)}
                />
                <Route
                  path="/treasory/transactions"
                  render={(props) => AuthGard(<Transactions {...props} />)}
                />{" "}
                <Route
                  path="/*"
                  render={(props) => AuthGard(<Transactions {...props} />)}
                />
              </Switch>
            )}
          </Content>
        </Container>
      </Container>
      <style jsx>{`
        .side-span {
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;

const routes = {
  "/clients": "Clients B2B",
  "/tiers/cca": "Comptes Superviseurs",
  "/representatives": "Représentants",
  "/checks": "Gestion des chéques",
  "/treasory/banks": "Banques",
  "/treasory/checkouts": "Caisses",
  "/treasory/transactions": "Transactions Caisses",
  "/": "Transactions Caisses",
  "/treasory/checkout_summary": "Recap. Caisses",
};
