import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./i18n";
import Main from "./pages/Main";

import NewUser from "./pages/NewUser";
import ListUser from "./pages/ListUser";
import NewAsset from "./pages/NewAsset";
import ListAsset from "./pages/ListAsset";
import ServiceSetting from "./pages/ServiceSetting";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  CurrentLoginContext,
  CurrentLoginProvider,
} from "./context/CurrentLogin";
import Success from "./pages/Success";
import ViewAsset from "./pages/ViewAsset";
import ViewAssetClient from "./pages/ViewAssetClient";

function App() {
  return (
    <CurrentLoginProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="/eff179b5-a575-4046-99f3-ca0dc465af3e"
            element={<Main children={<NewAsset />} />}
          />
          <Route
            path="/ed4599ce-5808-462c-b10f-3eee0df54dd1"
            element={<Main children={<ListAsset />} />}
          />
          <Route
            path="/0f55998a-7b77-426d-880d-3c6fd7ef4654"
            element={<Main children={<NewUser />} />}
          />
          <Route
            path="/a7e05d80-6fa2-452c-b3c7-f4177fad2534"
            element={<Main children={<ListUser />} />}
          />
          <Route
            path="/f8119f14-43bf-4b3b-906a-ed77be4bab3c"
            element={<Main children={<ServiceSetting />} />}
          />
          <Route
            path="/8e4314e1-ec72-47b5-84e2-114a5e7a697a"
            element={<Main children={<ViewAsset />} />}
          />
          <Route
            path="/cc815a57-69fb-4e29-a6f6-e8e7cfe8de66/:assetCode"
            element={<ViewAssetClient />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </BrowserRouter>
    </CurrentLoginProvider>
  );
}

export default App;
