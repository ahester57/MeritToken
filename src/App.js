import React, { Component } from 'react'
import MeritToken from '../build/contracts/MeritToken.json'
import getWeb3 from './utils/getWeb3'
import ipfsAPI from 'ipfs-api'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      added_file_hash: null,
      web3: null
    }
    this.ipfsApi = ipfsAPI('localhost', '5001')
  } 

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }


  mintTranscript = () => {
    const contract = require('truffle-contract')
    const meritToken = contract(MeritToken)
    meritToken.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var meritInstance;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      meritToken.deployed().then((instance) => {
        meritInstance = instance

        // Stores a given value, 5 by default.
        return meritInstance.mint(accounts[0], this.state.added_file_hash, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        console.log(result['logs'][0]['args'])
        console.log("tokenId=", result['logs'][0]['args']['_tokenId'].toNumber())
        return result; 
      })
    })

  }

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    console.log(reader)
    reader.onloadend = () => this.saveToIpfs(reader)
    reader.readAsArrayBuffer(file)
  }

  saveToIpfs = (reader) => {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    this.ipfsApi.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        this.setState({added_file_hash: ipfsId})
      }).then(() => {
        this.mintTranscript();
      }).catch((err) => {
        console.error(err)
      })

  }

  handleSubmit = (event) => {
    console.log("fsdajkl;fsdalkj;dsfajk;sfddffdaskj;") 
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Transcript</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <h2></h2>
              <form id='captureMedia' onSubmit={this.handleSubmit}>
                <input type='file' onChange={this.captureFile} />
              </form>
              <a href={'http://localhost:8080/ipfs/' + this.state.added_file_hash}>{this.state.added_file_hash}</a>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
