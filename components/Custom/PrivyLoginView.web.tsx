import { PrivyLoginProps } from "@/constants/ViewProps";
import React, { PropsWithChildren } from "react";
import { ViewProps } from "react-native";

// export const PrivyLoginView = ({ style, children }: PrivyLoginProps) => {
//   return <>{children}</>;
// };

import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";

import { Buffer } from "buffer";
global.Buffer = Buffer;

function LoginButton() {
  const { ready, authenticated, login, user, logout, createWallet } =
    usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  // Disable logout when Privy is not ready or the user is not authenticated
  const disableLogout = !ready || (ready && !authenticated);

  // useEffect(() => {
  //   // 调用一个接口
  //   window.postMessage.privyLoginSuccess(user);
  // }, [user]);

  return (
    <div>
      <button
        disabled={disableLogin}
        onClick={login}
        style={{ width: 200, height: 30, color: "red", borderRadius: 8 }}
      >
        Privy Login
      </button>
      <button
        disabled={disableLogout}
        onClick={logout}
        style={{ width: 200, height: 30, color: "green", borderRadius: 8 }}
      >
        Log out
      </button>
      <div>
        {user && (
          <>
            <button disabled={!(ready && authenticated)} onClick={createWallet}>
              Create a wallet
            </button>
            <p>User {user.id} has linked the following accounts:</p>
            <ul>
              <li>Apple: {user.apple ? user.apple.email : "None"}</li>
              <li>Discord: {user.discord ? user.discord.username : "None"}</li>
              <li>Email: {user.email ? user.email.address : "None"}</li>
              <li>
                Farcaster: {user.farcaster ? user.farcaster.username : "None"}
              </li>
              <li>GitHub: {user.github ? user.github.username : "None"}</li>
              <li>Google: {user.google ? user.google.email : "None"}</li>
              <li>
                Instagram: {user.instagram ? user.instagram.username : "None"}
              </li>
              <li>LinkedIn: {user.linkedin ? user.linkedin.email : "None"}</li>
              <li>Phone: {user.phone ? user.phone.number : "None"}</li>
              <li>Spotify: {user.spotify ? user.spotify.email : "None"}</li>
              <li>
                Telegram: {user.telegram ? user.telegram.username : "None"}
              </li>
              {/* <li>TikTok: {user.tiktok ? user.tiktok.email : "None"}</li> */}
              <li>Twitter: {user.twitter ? user.twitter.username : "None"}</li>
              <li>Wallet: {user.wallet ? user.wallet.address : "None"}</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export const PrivyLoginView = ({ style, children }: PrivyLoginProps) => {
  // return <>{children}</>;
  // };
  // function App() {
  return (
    <div className="App" style={{ backgroundColor: "gray", height: 300 }}>
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <LoginButton></LoginButton>
      </header>
    </div>
  );
};
