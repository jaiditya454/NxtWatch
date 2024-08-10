import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useCallback } from "react";

import Login from "./Components/Login";
import Home from "./Components/Home";
import Trending from "./Components/Trending";
import Gaming from "./Components/Gaming";
import SavedVideos from "./Components/SavedVideos";
import NotFound from "./Components/NotFound";
import VideoItemDetails from "./Components/VideoItemDetails";
import ProtectedRoute from "./Components/ProtectedRoute";

import ActiveMenuContext from "./Context/ActiveMenuContext";
import ThemeContext from "./Context/ThemeContext";
import SavedVideosContext from "./Context/SavedVideosContext";

import "./App.css";

const activeMenuConstants = {
  home: "HOME",
  trending: "TRENDING",
  gaming: "GAMING",
  savedVideos: "SAVED_VIDEOS",
};

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeMenu, setActiveMenu] = useState(activeMenuConstants.home);
  const [savedVideosList, setSavedVideosList] = useState([]);
  const [save, setSave] = useState(false);

  const addVideosToSavedVideos = useCallback((videoDetails) => {
    setSavedVideosList((prev) => [...prev, videoDetails]);
  }, []);

  const deleteVideosFromSavedVideos = useCallback((videoDetails) => {
    setSavedVideosList((prev) =>
      prev.filter((each) => each.id !== videoDetails.id)
    );
  }, []);

  const updateSaveVideosList = useCallback(
    (videoDetails) => {
      if (save) {
        deleteVideosFromSavedVideos(videoDetails);
      } else {
        addVideosToSavedVideos(videoDetails);
      }
    },
    [save, addVideosToSavedVideos, deleteVideosFromSavedVideos]
  );

  const updateSave = useCallback(
    (videoDetails) => {
      setSave((prev) => !prev);
      updateSaveVideosList(videoDetails);
    },
    [updateSaveVideosList]
  );

  const changeTheme = useCallback(() => {
    setIsDarkTheme((prev) => !prev);
  }, []);

  const changeActiveMenu = useCallback((value) => {
    setActiveMenu(value);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, changeTheme }}>
      <SavedVideosContext.Provider
        value={{
          save,
          savedVideosList,
          addVideosToSavedVideos,
          deleteVideosFromSavedVideos,
          updateSave,
        }}
      >
        <ActiveMenuContext.Provider value={{ activeMenu, changeActiveMenu }}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trending"
                element={
                  <ProtectedRoute>
                    <Trending />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gaming"
                element={
                  <ProtectedRoute>
                    <Gaming />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-videos"
                element={
                  <ProtectedRoute>
                    <SavedVideos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/videos/:id"
                element={
                  <ProtectedRoute>
                    <VideoItemDetails />
                  </ProtectedRoute>
                }
              />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
          </BrowserRouter>
        </ActiveMenuContext.Provider>
      </SavedVideosContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
