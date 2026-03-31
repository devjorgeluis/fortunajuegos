import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import "animate.css";

const Sports = () => {
    const pageTitle = "Sports";
    const { contextData } = useContext(AppContext);
    const [sportsEmbedUrl, setSportsEmbedUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const { setShowFullDivLoading } = useContext(NavigationContext);
    const location = useLocation();

    useEffect(() => {
        loadSportsPage();
        
        return () => {
            setShowFullDivLoading(false);
        };
    }, [location.pathname]);

    const loadSportsPage = () => {
        setShowFullDivLoading(true);
        setIsLoading(true);
        setHasError(false);
        setSportsEmbedUrl("");
        callApi(contextData, "GET", "/get-page?page=sports", callbackGetPage, null);
    };

    const callbackGetPage = (result) => {        
        if (result.status === 500 || result.status === 422) {
            setHasError(true);
            setIsLoading(false);
            setShowFullDivLoading(false);
        } else if (result.data && result.data.url_embed) {
            setTimeout(() => {
                setSportsEmbedUrl(result.data.url_embed);
                setIsLoading(false);
                setShowFullDivLoading(false);
            }, 100);
        } else {
            setHasError(true);
            setIsLoading(false);
            setShowFullDivLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="game-iframe-view_gameIframeWrapper game-iframe-view_sportbook">

            </div>
        );
    }

    if (hasError || !sportsEmbedUrl) {
        return (
            <div className="game-iframe-view_gameIframeWrapper game-iframe-view_sportbook">
                <div className="no-game">
                    <div className="leftWrapper">
                        <p className="forbiddenNumber">
                            403
                        </p>
                        <p className="forbiddenText">
                            Forbidden: Access is denied.
                            Sorry, your location is not covered by our service.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Show iframe when everything is ready
    return (
        <div className="game-iframe-view_gameIframeWrapper game-iframe-view_sportbook">
            <iframe
                src={sportsEmbedUrl}
                title="Sportsbook"
                className="game-iframe-view_gameIframe game-iframe-view_sportbook"
                allowFullScreen
                loading="lazy"
                style={{ border: 'none' }}
                onLoad={() => {
                    // Optional: hide loading indicator when iframe is fully loaded
                    console.log("Iframe loaded successfully");
                }}
                onError={() => {
                    // Handle iframe loading errors
                    setHasError(true);
                    setShowFullDivLoading(false);
                }}
            />
        </div>
    );
};

export default Sports;