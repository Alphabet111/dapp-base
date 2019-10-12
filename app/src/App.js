import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import "./App.css";

const contractAddress = '0x550B37d60Eb314256B7b3547F278E80A610681A0';

class App extends React.Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        contractAddress
        // deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      console.log(error);
      
      // Catch any errors for any of the above operations.
      alert(
        error
        // `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    return (
      <Router>
        <div>
          <div>The stored value is: {this.state.storageValue}</div>
          <input type="number" ref='inputValue' style={{ width: 200, height: 50, marginTop: 100 }} />
          <button style={{ marginLeft: 50, width: 100, height: 50, padding: 20 }}
            onClick={() => {
              const value = Number(this.refs.inputValue.value);
              console.log(value);
              const { accounts, contract } = this.state;
              contract.methods.set(value).send({ from: accounts[0] }).then(() => {
                console.log('成功');
                contract.methods.get().call().then((result) => {
                  console.log(result);
                  this.setState({ storageValue: result })
                })
              });
            }}>设置</button>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>

          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

class Home extends React.Component {
  render() {
    return <h2>Home</h2>;
  }
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default App;
