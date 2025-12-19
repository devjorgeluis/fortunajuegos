import { useContext, useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import DropWins from "../components/Home/DropWins";
import PopularGames from "../components/Home/PopularGames";
import GameCategories from "../components/Home/GameCategories";
import ProviderContainer from "../components/ProviderContainer";
import Promotions from "../components/Home/Promotions";
import GameModal from "../components/Modal/GameModal";
import LoginModal from "../components/Modal/LoginModal";
import Footer from "../components/Layout/Footer";
import "animate.css";

import ImgLogoTransparent from "/src/assets/svg/logo-transparent.svg";
import ImgCategoryBackground1 from "/src/assets/img/category-background1.webp";
import ImgCategoryBackground2 from "/src/assets/img/category-background2.webp";
import ImgCategoryBackground3 from "/src/assets/img/category-background3.webp";
import ImgCategoryBackground4 from "/src/assets/img/category-background4.webp";
import ImgCategory1 from "/src/assets/img/category1.webp";
import ImgCategory2 from "/src/assets/img/category2.webp";
import ImgCategory3 from "/src/assets/img/category3.webp";
import ImgCategory4 from "/src/assets/img/category4.webp";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const Home = () => {
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [topLiveCasino, setTopLiveCasino] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isGameLoadingError, setIsGameLoadingError] = useState(false);
  const refGameModal = useRef();
  const { isSlotsOnly, isMobile } = useOutletContext();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '') {
          getPage("home");
          getStatus();

          selectedGameId = null;
          selectedGameType = null;
          selectedGameLauncher = null;
          setShouldShowGameModal(false);
          setGameUrl("");
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);

    getPage("home");
    getStatus();

    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const isSlotsOnlyFalse = isSlotsOnly === false || isSlotsOnly === "false";
    let tmpTags = isSlotsOnlyFalse
      ? [
        { name: "Populares", code: "hot", image: ImgCategory1, backgroundImage: ImgCategoryBackground1 },
        { name: "Jokers", code: "joker", image: ImgCategory2, backgroundImage: ImgCategoryBackground2 },
        { name: "Juegos de crash", code: "arcade", image: ImgCategory3, backgroundImage: ImgCategoryBackground3 },
        { name: "Ruletas", code: "roulette", image: ImgCategory4, backgroundImage: ImgCategoryBackground4 },
      ]
      : [
        { name: "Populares", code: "hot", image: ImgCategory1, backgroundImage: ImgCategoryBackground1 },
        { name: "Jokers", code: "joker", image: ImgCategory2, backgroundImage: ImgCategoryBackground2 },
        { name: "Megaways", code: "megaways", image: ImgCategory4, backgroundImage: ImgCategoryBackground4 },
      ];

    setTags(tmpTags);
  }, [isSlotsOnly]);

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
  };

  const callbackGetStatus = (result) => {
    if (result.status === 500 || result.status === 422) {

    } else {
      setTopGames(result.top_hot);
      setTopLiveCasino(result.top_livecasino);
      contextData.slots_only = result && result.slots_only;
    }
  };

  const getPage = (page) => {
    setCategories([]);
    setGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {

    } else {
      setCategories(result.data.categories);
      setPageData(result.data);
      setSelectedProvider(null);

      if (result.data.menu === "home") {
        setMainCategories(result.data.categories);
      }

      if (pageData.url && pageData.url !== null) {
        if (contextData.isMobile) {
          // Mobile sports workaround
        }
      } else {
        if (result.data.page_group_type === "categories") {
          setSelectedCategoryIndex(-1);
        }
        if (result.data.page_group_type === "games") {
          loadMoreContent();
        }
      }
      pageCurrent = 0;
    }
  };

  const loadMoreContent = () => {
    let item = categories[selectedCategoryIndex];
    if (item) {
      fetchContent(item, item.id, item.table_name, selectedCategoryIndex, false);
    }
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    let pageSize = 30;

    if (resetCurrentPage === true) {
      pageCurrent = 0;
      setGames([]);
    }

    setSelectedCategoryIndex(categoryIndex);

    const groupCode = pageGroupCode || pageData.page_group_code || "default_pages_home"

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    if (selectedProvider && selectedProvider.id) {
      apiUrl += "&provider=" + selectedProvider.id;
    }

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {

    } else {
      if (pageCurrent === 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
    }
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local !== null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id !== null ? game.id : selectedGameId;
    selectedGameType = type !== null ? type : selectedGameType;
    selectedGameLauncher = launcher !== null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status === "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    } else {
      setIsGameLoadingError(true);
    }
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleCategorySelect = () => {
    setSelectedProvider(null);
  };

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);

    if (provider) {
      setSelectedCategoryIndex(-1);

      fetchContent(
        provider,
        provider.id,
        provider.table_name,
        index,
        true
      );

      if (isMobile) {
        setMobileShowMore(true);
      }
    } else {
      const firstCategory = categories[0];
      if (firstCategory) {
        setActiveCategory(firstCategory);
        setSelectedCategoryIndex(0);
        fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true);
      }
    }
  };

  return (
    <>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={handleLoginConfirm}
        />
      )}

      {shouldShowGameModal && selectedGameId !== null ? (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          gameImg={selectedGameImg}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
        />
      ) : (
        <>
          <div className="overflow-x-hidden [grid-area:main] pt-4">
            <div className="grid grid-rows-[max-content] [grid-template-areas:_'left-column'_'main-column'_'right-column'] lg:grid-cols-[auto_1fr_auto] lg:[grid-template-areas:_'left-column_main-column_right-column']">
              <div className="max-w-[100vw] [grid-area:main-column]">
                <div className="flex flex-col gap-4">
                  <div className="gap-4 container md:grid md:grid-cols-1">
                    <div className="flex flex-col">
                      <DropWins />
                      <PopularGames games={topGames} icon={ImgLogoTransparent} title="Juegos Populares" onGameClick={(game) => {
                        if (isLogin) {
                          launchGame(game, "slot", "tab");
                        } else {
                          setShowLoginModal(true);
                        }
                      }} />
                      <GameCategories
                        categories={tags}
                        selectedCategoryIndex={selectedCategoryIndex}
                        onCategoryClick={(tag, _id, _table, index) => {
                          if (window.location.hash !== `#${tag.code}`) {
                            window.location.hash = `#${tag.code}`;
                          } else {
                            setSelectedCategoryIndex(index);
                            getPage(tag.code);
                          }
                        }}
                        onCategorySelect={handleCategorySelect}
                        isMobile={isMobile}
                        pageType="home"
                      />
                      <ProviderContainer
                        categories={categories}
                        selectedProvider={selectedProvider}
                        setSelectedProvider={setSelectedProvider}
                        onProviderSelect={handleProviderSelect}
                      />
                      <Promotions />
                      <Footer />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {
        isGameLoadingError && <div className="container">
          <div className="row">
            <div className="col-md-6 error-loading-game">
              <div className="alert alert-warning">Error al cargar el juego. Inténtalo de nuevo o ponte en contacto con el equipo de soporte.</div>
              <a className="btn btn-primary" onClick={() => window.location.reload()}>Volver a la página principal</a>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Home;