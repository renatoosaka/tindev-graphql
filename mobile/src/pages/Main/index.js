import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import io from "socket.io-client";
import {
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import logo from "../../assets/logo.png";
import likeImg from "../../assets/like.png";
import dislikeImg from "../../assets/dislike.png";
import itsamatch from "../../assets/itsamatch.png";

export default ({ navigation }) => {
  const id = navigation.getParam("user");
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  const context = {
    headers: {
      user: id
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
      query: { user: id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });
  }, [id]);

  useQuery(GET_DEVS, {
    context,
    fetchPolicy: "cache-and-network",
    onCompleted: ({ devs }) => setUsers(devs)
  });

  const [like] = useMutation(LIKE, { context });

  const [dislike] = useMutation(DISLIKE, { context });

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate("Login");
  };

  const handleLike = async () => {
    const [{ _id }, ...rest] = users;
    await like({ variables: { devId: _id } });
    setUsers(rest);
  };
  const handleDislike = async () => {
    const [{ _id }, ...rest] = users;
    await dislike({ variables: { devId: _id } });
    setUsers(rest);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
      {users.length > 0 ? (
        <>
          <View style={styles.cardsContainer}>
            {users.map((user, index) => (
              <View
                key={user._id}
                style={[styles.card, { zIndex: users.length - index }]}
              >
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.footer}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.bio} numberOfLines={3}>
                    {user.bio}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleDislike}>
              <Image source={dislikeImg} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLike}>
              <Image source={likeImg} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Acabou :(</Text>
        </View>
      )}

      {matchDev && (
        <View style={styles.matchContainer}>
          <Image source={itsamatch} style={styles.matchImage} />
          <Image source={{ uri: matchDev.avatar }} style={styles.matchAvatar} />
          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>
          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.matchClose}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    marginTop: 50
  },
  cardsContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 500
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 30,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  avatar: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  bio: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    lineHeight: 20
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 30,
    zIndex: 1
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  empty: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center"
  },
  emptyText: {
    fontSize: 16,
    alignSelf: "center",
    color: "#999",
    fontWeight: "bold"
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100000
  },
  matchImage: {
    height: 60,
    resizeMode: "contain"
  },
  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: "#fff",
    marginVertical: 30
  },
  matchName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff"
  },
  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 30
  },
  matchClose: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 30,
    fontWeight: "bold"
  }
});
