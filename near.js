import * as nearAPI from "../lib/near-api-js.js"

const { connect, keyStores, WalletConnection, Contract } = nearApi;
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
    changeMethods: [   "guardar_puntuacion" ],
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
    var result = await contract.obtener_puntuacion({}, 300000000000000);
    return result.puntuacion;
}
export async function GuardarPuntuacion(score){
    await contract.guardar_puntuacion({puntuacion: score}, 300000000000000);
}
export async function ObtenerPuntuaciones(){
    var result = await contract.obtener_puntuaciones({});
    return result;
}
