import React from "react";
import { YellowBox } from "react-native";
import Routes from "./src/Routes";
import { ApolloProvider } from "@apollo/react-hooks";
import { client } from "./src/Services";

YellowBox.ignoreWarnings(["Unrecognized WebSocket"]);

export default function App() {
  return (
    <ApolloProvider {...{ client }}>
      <Routes />
    </ApolloProvider>
  );
}
