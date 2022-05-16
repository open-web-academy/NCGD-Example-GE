import * as nearAPI from "../lib/near-api-js.js"

const { connect, keyStores, WalletConnection, Contract, utils, providers } = nearApi;
const config = {
      networkId: 'testnet',
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org'
    
}
const near = await connect(config);
const wallet = new WalletConnection(near, 'ncd-ii');
const contract_id = "dev-1651705434142-32114550667177";

const provider = new providers.JsonRpcProvider(
  "https://archival-rpc.testnet.near.org"
);

const contract = new Contract(wallet.account(), contract_id, {
    viewMethods: [ ],
    changeMethods: [ ],
    sender: wallet.account()
});

export function Login() {
    wallet.requestSignIn(
        contract_id,
        "Game Developer",
        window.location.origin,
    );
}
export function LogOut() {
    wallet.signOut();
}
export function IsConnected() {
    return wallet.isSignedIn();
}
export function GetAccountId(){
    return wallet.getAccountId()
}