import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  Button,
  ButtonToolbar,
  Content,
  FlexboxGrid,
  Form,
  Message,
  Panel,
} from "rsuite";
import { AuthService } from "../../Api/auth.service";
import { isLogged } from "../../Atoms/auth.atom";
import { AiOutlineFileDone } from "react-icons/ai";
import { userAtom } from "../../Atoms/user.atom";

export default function Login(props) {
  const setLogged = useSetRecoilState(isLogged);
  const [user, setUser] = useRecoilState(userAtom);
  const [model, setmodel] = useState({ username: "", password: "" });
  const [error, seterror] = useState("");
  function authenticate() {
    if (model.username && model.password)
      AuthService()
        .login(model)
        .then((res) => {
          if (res.data.success) {
            localStorage.setItem("auth", JSON.stringify(res.data));
            setLogged(true);
            setUser(res.data);
            seterror("");
          } else seterror(res.data.message);
        })
        .catch((er) => seterror(er.Message));
  }
  return (
    <div>
      {" "}
      <h1
        style={{
          color: "rgb(36, 156, 82)",
          textAlign: "center",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AiOutlineFileDone /> cashflow
      </h1>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={12}>
            <Panel
              style={{ background: "#fff" }}
              header={<h3>Connexion</h3>}
              bordered
            >
              <Form fluid>
                <Form.Group>
                  <Form.ControlLabel>
                    Nom d'utilisateur ou email:
                  </Form.ControlLabel>
                  <Form.Control
                    name="username"
                    onChange={(username) => {
                      setmodel((prev) => {
                        return { ...prev, username };
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Mot de passe :</Form.ControlLabel>
                  <Form.Control
                    name="password"
                    type="password"
                    onChange={(password) => {
                      setmodel((prev) => {
                        return { ...prev, password };
                      });
                    }}
                    autoComplete="off"
                  />
                </Form.Group>

                {error && (
                  <Message showIcon type="error">
                    {error}
                  </Message>
                )}
                <br></br>
                <Form.Group>
                  <ButtonToolbar>
                    <Button
                      appearance="primary"
                      color="green"
                      onClick={authenticate}
                    >
                      Connexion
                    </Button>
                    <Button appearance="link">Mot de pass oublié?</Button>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </div>
  );
}
