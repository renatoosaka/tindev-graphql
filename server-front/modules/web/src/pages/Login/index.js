import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Container, Form, Input, Button } from "./styles";
import { Logo } from "~/Styles";

export default ({ history }) => {
  const CREATE_DEV = gql`
    mutation($username: String!) {
      create(username: $username) {
        _id
        name
      }
    }
  `;

  const [username, setUsername] = useState("");
  const [create] = useMutation(CREATE_DEV, {
    onCompleted: ({ create: { _id } }) => {
      localStorage.setItem("@osakalabs/devId", _id);
      history.push(`/dev/${_id}`);
    }
  });
  const onSubmit = e => {
    e.preventDefault();
    create({ variables: { username } });
  };

  return (
    <Container>
      <Form {...{ onSubmit }}>
        <Logo />
        <Input
          placeholder="Digite o seu usuário no Github"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <Button type="submit">Enviar</Button>
      </Form>
    </Container>
  );
};
