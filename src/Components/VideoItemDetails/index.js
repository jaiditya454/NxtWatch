import React, { useState, useEffect, useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import { BiLike, BiDislike } from "react-icons/bi";
import { RiMenuAddLine } from "react-icons/ri";
import Cookies from "js-cookie";
import ReactPlayer from "react-player";
import { ThreeDots } from "react-loader-spinner";
import Header from "../Header";
import Sidebar from "../Sidebar";
import ThemeContext from "../../Context/ThemeContext";
import SavedVideosContext from "../../Context/SavedVideosContext";
import {
  MainBody,
  SidebarContainer,
  FailureImg,
  FailureContainer,
  FailureText,
  RetryButton,
  LoaderContainer,
  VideoItemDetailsContainer,
  PlayerContainer,
  VideoDetailContainer,
  VideoTextContainer,
  VideoTitle,
  ViewsAndPostedContainer,
  LikesAndViewsContainer,
  ViewsText,
  Button,
  ChannelLogo,
  ChannelDetails,
  ChannelDetailsText,
  ChannelDetailsText2,
  VideoDescriptionText,
} from "./styledComponents";
import { useParams } from "react-router-dom";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const VideoItemDetails = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [videoDetails, setVideoDetails] = useState({});
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const { id } = useParams(); // Get video ID from URL
  const { isDarkTheme } = useContext(ThemeContext);
  const { updateSave, savedVideosList } = useContext(SavedVideosContext);

  useEffect(() => {
    const getVideoDetails = async () => {
      setApiStatus(apiStatusConstants.inProgress);
      const jwtToken = Cookies.get("jwt_token");
      const url = `https://apis.ccbp.in/videos/${id}`;
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: "GET",
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        const updatedData = {
          id: data.video_details.id,
          description: data.video_details.description,
          publishedAt: data.video_details.published_at,
          thumbnailUrl: data.video_details.thumbnail_url,
          title: data.video_details.title,
          videoUrl: data.video_details.video_url,
          viewCount: data.video_details.view_count,
          channel: {
            name: data.video_details.channel.name,
            profileImageUrl: data.video_details.channel.profile_image_url,
            subscriberCount: data.video_details.channel.subscriber_count,
          },
        };
        setVideoDetails(updatedData);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    };

    getVideoDetails();
  }, [id]);

  const updateLikeState = () => {
    setLike((prev) => !prev);
    setDislike(false);
  };

  const updateDislikeState = () => {
    setDislike((prev) => !prev);
    setLike(false);
  };

  const successView = () => {
    const {
      publishedAt,
      title,
      videoUrl,
      viewCount,
      channel,
      description,
      id,
    } = videoDetails;

    const { name, profileImageUrl, subscriberCount } = channel;
    let postedAt = formatDistanceToNow(new Date(publishedAt));
    const postedAtList = postedAt.split(" ");

    if (postedAtList.length === 3) {
      postedAtList.shift();
      postedAt = postedAtList.join(" ");
    }

    const likeIsActive = like ? "active" : "not-active";
    const dislikeIsActive = dislike ? "active" : "not-active";

    const present = savedVideosList.find((each) => each.id === id);
    const saveIsActive = present ? "active" : "not-active";
    const saveText = present ? "Saved" : "Save";

    return (
      <VideoDetailContainer>
        <PlayerContainer>
          <ReactPlayer url={videoUrl} controls width="100%" height="100%" />
        </PlayerContainer>
        <VideoTextContainer>
          <VideoTitle theme={isDarkTheme ? "dark" : "light"}>
            {title}
          </VideoTitle>
          <LikesAndViewsContainer>
            <ViewsAndPostedContainer>
              <ViewsText>{viewCount} views</ViewsText>
              <ViewsText>{postedAt} ago</ViewsText>
            </ViewsAndPostedContainer>
            <div>
              <Button
                type="button"
                theme={likeIsActive}
                onClick={updateLikeState}
              >
                <BiLike size={20} style={{ paddingTop: "6px" }} />
                Like
              </Button>
              <Button
                type="button"
                theme={dislikeIsActive}
                onClick={updateDislikeState}
              >
                <BiDislike size={20} style={{ paddingTop: "6px" }} />
                Dislike
              </Button>
              <Button
                type="button"
                theme={saveIsActive}
                onClick={() => updateSave(videoDetails)}
              >
                <RiMenuAddLine size={20} style={{ paddingTop: "6px" }} />
                {saveText}
              </Button>
            </div>
          </LikesAndViewsContainer>
          <hr />
          <ChannelDetails>
            <ChannelLogo src={profileImageUrl} alt="channel logo" />
            <div>
              <ChannelDetailsText theme={isDarkTheme ? "dark" : "light"}>
                {name}
              </ChannelDetailsText>
              <ChannelDetailsText2>{subscriberCount}</ChannelDetailsText2>
            </div>
          </ChannelDetails>
          <VideoDescriptionText theme={isDarkTheme ? "dark" : "light"}>
            {description}
          </VideoDescriptionText>
        </VideoTextContainer>
      </VideoDetailContainer>
    );
  };

  const failureView = () => (
    <FailureContainer>
      <FailureImg
        src={
          isDarkTheme
            ? "https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png"
            : "https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        }
        alt="failure view"
      />
      <FailureText theme={isDarkTheme ? "dark" : "light"}>
        Oops! Something Went Wrong
      </FailureText>
      <FailureText as="p" theme={isDarkTheme ? "dark" : "light"}>
        We are having some trouble to complete your request. Please try again.
      </FailureText>
      <RetryButton
        type="button"
        onClick={() => setApiStatus(apiStatusConstants.initial)}
      >
        Retry
      </RetryButton>
    </FailureContainer>
  );

  const loader = () => (
    <LoaderContainer className="loader-container" data-testid="loader">
      <ThreeDots
        color={isDarkTheme ? "#ffffff" : "#000000"}
        height={50}
        width={50}
      />
    </LoaderContainer>
  );

  const checkApiStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return successView();
      case apiStatusConstants.failure:
        return failureView();
      case apiStatusConstants.inProgress:
        return loader();
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <MainBody>
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
        <VideoItemDetailsContainer
          data-testid="videoItemDetails"
          theme={isDarkTheme ? "dark" : "light"}
        >
          {checkApiStatus()}
        </VideoItemDetailsContainer>
      </MainBody>
    </div>
  );
};

export default VideoItemDetails;
