import logo from './MTK.png';
import animacao from './animacao.gif';
import './App.css';
import web3 from './web3';
import myContract from './myContract';
import React from "react";


class App extends React.Component {

   constructor(props) {
    super(props);
      
    this.state = {
      txHash: '',
      accountFrom: '',
      accountTo: '',
      balance: 0,
      amountTokens: 0,
      showElement: false,
      transactions: []         
    }   
  }
  
  async getBalance(){
    const balance = await myContract.methods.balanceOf(this.state.accountFrom).call();     
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') });   
  }

  async componentDidMount() {

     if (web3.eth.accounts.wallet.load('passwordxyz').length === 0){
      
        console.log("CRIACAO DA CONTA E DA CARTEIRA");
        //criar conta	
        const account = web3.eth.accounts.create();
        console.log(account);

        //criar carteira
        let wallet = web3.eth.accounts.wallet.create();
        console.log('Resultado da criacao da carteira');
        console.log(wallet); 
        
        //adicionar a conta na carteira
        let walletAccount = web3.eth.accounts.wallet.add(account);
        console.log('Resultado da adicao da conta na carteira');
        console.log(walletAccount);

        // Armazena a carteira criptografada no armazenamento local 
        web3.eth.accounts.wallet.save('passwordxyz');
        console.log('Carteira salva');
        
     } 
     else 
    {
      web3.eth.accounts.wallet.load('passwordxyz');
      window.alert('Carteira Carregada');     
    }

    const accounts = await web3.eth.accounts.wallet;   
    this.setState({ accountFrom: accounts[0].address });
    
    this.getBalance();

    this.setState({ txHash: '0x...' });

    const transactions = await myContract.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } });
    this.setState({ transactions: transactions });
    console.log(transactions);

   
   
  }  
   
  onSubmit = async(event) => {    
    
    event.preventDefault();      

    this.setState({ txHash: 'PENDENTE - AGUARDE' });
    this.setState({ showElement: true });

    const amount = web3.utils.toWei(this.state.amountTokens, 'Ether');     
    const transactionHash = await myContract.methods.transfer(this.state.accountTo, amount).send({ 
       from: this.state.accountFrom,
       gasLimit: web3.utils.toHex('53000'),      
      });                 
     
    this.setState({ txHash: transactionHash.transactionHash });     
    this.getBalance();   
    this.setState({ showElement: false });
   
  }
  
  

  render()
  {  
    return (
      <div className="App" > 
          <br/>
          <img src={logo}  alt="logo" /> 
          <br/>         
          <div>
            Endereço da Conta:  {this.state.accountFrom}
          </div>
          <div>
            <h1>{this.state.balance} MTK</h1>
          </div>
          <div>
            <h3> Enviar Token </h3>  
          </div>  
                   
          <form onSubmit={this.onSubmit}> 
            <div className="form-group mr-sm-2"> 
              <label>Endereço do destinatário: </label>
              <br/>
              <input placeholder="Endereço" value = {this.state.accountTo} onChange = {event => this.setState({accountTo: event.target.value})} /> 
            </div> 
            <div className="form-group mr-sm-2"> 
              <label>Quantidade: </label> 
              <br/>
              <input placeholder="Quantidade" value = {this.state.amountTokens} onChange = {event => this.setState({amountTokens: event.target.value})} /> 
            </div>
            <br/>
            <button className="btn btn-primary btn-block"> Enviar </button>             		
			    </form>

          <br/>
          { this.state.showElement ? <img src={animacao} className="App-logo" alt="animacao" />  : null }
          <div>
            Hash da transação:  {this.state.txHash}
          </div>
          <div>
            <h4>Histórico de Transações</h4>
          </div>
          <div className="center">
              <table className="table" border="1">
                      <thead>
                        <tr>
                          <th scope="col">Destinatário</th>
                          <th scope="col">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        { this.state.transactions.map((tx, key) => {
                          return (
                            <tr key={key} >
                              <td>{tx.returnValues.to}</td>
                              <td>{web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')}</td>
                            </tr>
                          )
                        }) }
                      </tbody>
              </table>
          </div>

      </div>
    );
  }
}

export default App;
