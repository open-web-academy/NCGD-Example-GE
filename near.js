import * as nearAPI from "../lib/near-api-js.js"

const { connect, keyStores, WalletConnection, Contract, providers } = nearApi;
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
const contract_id = "dev-1652728160134-47102512188392";

const contract = new Contract(wallet.account(), contract_id, {
    viewMethods: [ "obtener_puntuacion", "obtener_puntuaciones" ],
    changeMethods: [ "guardar_puntuacion" ],
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
export async function ObtenerPuntuacion(){
    var result = await contract.obtener_puntuacion({owner_id:GetAccountId()});
    return result.puntuacion;
}
export async function GuardarPuntuacion(score){
    await contract.guardar_puntuacion({puntuacion: score}, 300000000000000);
}
export async function ObtenerPuntuaciones(){
    var result = await contract.obtener_puntuaciones({});
    return result;
}
const provider = new providers.JsonRpcProvider(
    "https://archival-rpc.testnet.near.org"
  );
export async function GetInfoByURL(){
    return new Promise(async resolve => {
    let URLactual = window.location.toString();
        if(URLactual.indexOf("?") == -1){
            resolve(null);
        } else {
            if(URLactual.indexOf("transactionHashes") !== -1){
                let start = URLactual.indexOf("=");
                let end = URLactual.indexOf("&");
                let transactionHashes = URLactual.substring(start + 1, end == -1 ? URLactual.length : end);
                
                const resultJson = await provider.txStatus(transactionHashes, GetAccountId());
                resolve(resultJson);
            }
            else if(URLactual.indexOf("rejected") !== -1) {
               console.log("operacion cancelada")
                resolve(null);
            }
        }
    history.pushState('Home', 'Title', '/');
    });
}
