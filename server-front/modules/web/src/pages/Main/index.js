import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import io from "socket.io-client";
import Loading from "~/components/Loading";
import { Logo } from "~/Styles";
import {
  Container,
  List,
  Item,
  Image,
  Footer,
  Title,
  Text,
  ButtonContainer,
  Button,
  ImageLike,
  ImageDislike,
  Empty,
  MatchContainer,
  MatchImage,
  MatchAvatar,
  MatchTitle,
  MatchBio,
  MatchClose
} from "./styles";

export default ({ match }) => {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  const context = {
    headers: {
      user: match.params.id
    }
  };

  const GET_DEVS = gql`
    query {
      devs {
        _id
        user
        name
        bio
        avatar
      }
    }
  `;

  const LIKE = gql`
    mutation($devId: String!) {
      like(devId: $devId) {
        _id
      }
    }
  `;

  const DISLIKE = gql`
    mutation($devId: String!) {
      dislike(devId: $devId) {
        _id
      }
    }
  `;

  useEffect(() => {
    const socket = io("http://localhost:9000", {
      query: { user: match.params.id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });
  }, [match.params.id]);

  const { loading } = useQuery(GET_DEVS, {
    context,
    fetchPolicy: "cache-and-network",
    onCompleted: ({ devs }) => setUsers(devs)
  });

  const [like] = useMutation(LIKE, {
    context
  });

  const [dislike] = useMutation(DISLIKE, {
    context
  });

  const onClickLike = async id => {
    await like({ variables: { devId: id } });
    setUsers(users.filter(user => user._id !== id));
  };

  const onClickDislike = async id => {
    await dislike({ variables: { devId: id } });
    setUsers(users.filter(user => user._id !== id));
  };

  if (loading) return <Loading />;

  return (
    <Container>
      <Link to="/">
        <Logo />
      </Link>
      {users.length > 0 ? (
        <List>
          {users.map(user => (
            <Item key={user._id}>
              <Image src={user.avatar} alt={user.name} />
              <Footer>
                <Title>{user.name}</Title>
                <Text>{user.bio}</Text>
              </Footer>
              <ButtonContainer>
                <Button onClick={e => onClickDislike(user._id)}>
                  <ImageDislike />
                </Button>
                <Button onClick={e => onClickLike(user._id)}>
                  <ImageLike />
                </Button>
              </ButtonContainer>
            </Item>
          ))}
        </List>
      ) : (
        <Empty>Acabou :( </Empty>
      )}

      {matchDev && (
        <MatchContainer>
          <MatchImage />
          <MatchAvatar src={matchDev.avatar} />
          <MatchTitle>{matchDev.name}</MatchTitle>
          <MatchBio>{matchDev.bio}</MatchBio>
          <MatchClose onClick={() => setMatchDev(null)}>Fechar</MatchClose>
        </MatchContainer>
      )}
    </Container>
  );
};
