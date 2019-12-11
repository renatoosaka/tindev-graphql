import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { client } from "~/Services";
import Routes from "~/Routes";
import { GlobalStyles } from "~/Styles";

function App() {
  return (
    <ApolloProvider {...{ client }}>
      <GlobalStyles />
      <Routes />;
    </ApolloProvider>
  );
}

export default App;
