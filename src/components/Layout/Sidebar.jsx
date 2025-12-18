import { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import ImgCasino from "/src/assets/svg/casino.svg";
import ImgLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgSports from "/src/assets/svg/sports.svg";

const Sidebar = ({ isSlotsOnly, isMobile }) => {
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const { contextData } = useContext(AppContext);
    const location = useLocation();

    const [expandedMenus, setExpandedMenus] = useState([]);
    const [liveCasinoMenus, setLiveCasinoMenus] = useState([]);
    const [hasFetchedLiveCasino, setHasFetchedLiveCasino] = useState(false);
    const [activeSubmenuItem, setActiveSubmenuItem] = useState("");
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);

    const iconRefs = useRef({});
    const popoverRef = useRef(null);
    const hoverTimeoutRef = useRef(null);

    const toggleMenu = (menuId) => {
        if (!isSidebarExpanded) return;
        setExpandedMenus((prev) =>
            prev.includes(menuId)
                ? prev.filter((item) => item !== menuId)
                : [...prev, menuId]
        );
    };

    const isMenuExpanded = (menuId) => expandedMenus.includes(menuId);

    useEffect(() => {
        if (!hasFetchedLiveCasino) {
            getPage("livecasino");
        }

        const hash = location.hash.slice(1);
        if (hash) {
            setActiveSubmenuItem(hash);
            if (location.pathname === "/live-casino" && !isMenuExpanded("live-casino")) {
                toggleMenu("live-casino");
            }
        } else {
            setActiveSubmenuItem("");
        }

        window.scrollTo(0, 0);
    }, [location.pathname, location.hash, hasFetchedLiveCasino]);

    const getPage = (page) => {
        callApi(contextData, "GET", `/get-page?page=${page}`, callbackGetPage, null);
    };

    const callbackGetPage = (result) => {
        if (result.status === 500 || result.status === 422) return;

        const menus = [
            { name: "Inicio", code: "home", href: "/live-casino#home" },
        ];

        result.data.categories.forEach((element) => {
            menus.push({
                name: element.name,
                href: `/live-casino#${element.code}`,
                code: element.code,
            });
        });

        setLiveCasinoMenus(menus);
        setHasFetchedLiveCasino(true);
    };

    const handleMouseEnter = (itemId, event) => {
        if (!isSidebarExpanded) {
            clearTimeout(hoverTimeoutRef.current);
            
            const iconElement = event.currentTarget;
            const rect = iconElement.getBoundingClientRect();
            
            setPopoverPosition({
                top: rect.top + window.scrollY,
                left: rect.right + 16,
            });
            
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredMenu(itemId);
                setIsPopoverVisible(true);
            }, 150);
        }
    };

    const handleMouseLeave = (event) => {
        if (!isSidebarExpanded) {
            clearTimeout(hoverTimeoutRef.current);
            
            // Check if mouse is moving to popover
            const relatedTarget = event.relatedTarget;
            const popoverElement = popoverRef.current;
            
            if (popoverElement && popoverElement.contains(relatedTarget)) {
                // Mouse is moving to popover, keep it open
                return;
            }
            
            hoverTimeoutRef.current = setTimeout(() => {
                setIsPopoverVisible(false);
                setHoveredMenu(null);
            }, 100);
        }
    };

    const handlePopoverMouseEnter = () => {
        clearTimeout(hoverTimeoutRef.current);
    };

    const handlePopoverMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsPopoverVisible(false);
            setHoveredMenu(null);
        }, 100);
    };

    const isSlotsOnlyMode = isSlotsOnly === true || isSlotsOnly === "true";

    const menuItems = !isSlotsOnlyMode
        ? [
              {
                  id: "casino",
                  name: "Casino",
                  image: ImgCasino,
                  href: "/casino",
                  subItems: [
                      { name: "Lobby", href: "/casino#home" },
                      { name: "Populares", href: "/casino#hot" },
                      { name: "Jokers", href: "/casino#joker" },
                      { name: "Juegos de Crash", href: "/casino#arcade" },
                      { name: "Megaways", href: "/casino#megaways" },
                      { name: "Ruletas", href: "/casino#roulette" },
                  ],
              },
              {
                  id: "live-casino",
                  name: "Casino en Vivo",
                  image: ImgLiveCasino,
                  href: "/live-casino",
                  subItems: liveCasinoMenus,
              },
              {
                  id: "sports",
                  name: "Deportes",
                  image: ImgSports,
                  href: "/sports",
                  subItems: [
                      { name: "Inicio", href: "/sports" },
                      { name: "En Vivo", href: "/live-sports" },
                  ],
              },
          ]
        : [
              {
                  id: "casino",
                  name: "Casino",
                  image: ImgCasino,
                  href: "/casino",
                  subItems: [
                      { name: "Lobby", href: "/casino#home" },
                      { name: "Populares", href: "/casino#hot" },
                      { name: "Jokers", href: "/casino#joker" },
                      { name: "Juegos de Crash", href: "/casino#arcade" },
                      { name: "Megaways", href: "/casino#megaways" },
                      { name: "Ruletas", href: "/casino#roulette" },
                  ],
              },
          ];

    return (
        <>
            <aside
                className={`bg-primary-900 text-primary-50 border-theme-secondary/10 z-50 flex h-full flex-col justify-between gap-4 border-r text-base [grid-area:_nav] sticky top-[var(--header-height)] max-h-[calc(100svh-var(--header-height))] min-h-[unset] lg:max-w-[15rem] transition-all duration-300 ${
                    isSidebarExpanded ? "w-[16rem]" : "w-[4.25rem]"
                }`}
            >
                <div className="w-full !overflow-x-clip h-full px-2 pb-0 pt-2 sm:p-12 sm:pb-0 sm:px-2 sm:pt-2">
                    <div className="w-full h-full relative">
                        <nav className="flex flex-col gap-2">
                            {menuItems.map((item, index) => {
                                const menuTextColor = isMenuExpanded(item.id)
                                    ? "text-theme-secondary"
                                    : "text-theme-secondary-50";

                                // Ref for vertical alignment
                                const itemRef = (el) => (iconRefs.current[item.id] = el);

                                if (!isSidebarExpanded) {
                                    return (
                                        <div
                                            key={item.id}
                                            className="group relative"
                                            ref={itemRef}
                                            onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            {/* Icon Button */}
                                            <a
                                                href={item.href}
                                                className={`text-theme-secondary ring-theme-secondary/10 flex aspect-square w-full items-center justify-center gap-2.5 rounded-2xl p-4 ring-1 transition duration-75 hover:ring-theme-secondary hover:cursor-pointer ${
                                                    item.id === "casino" || item.id === "live-casino"
                                                        ? "bg-theme-secondary/20"
                                                        : "bg-transparent"
                                                }`}
                                            >
                                                <img src={item.image} alt={item.name} className="h-5 w-5" />
                                            </a>
                                        </div>
                                    );
                                }

                                // Expanded Mode (unchanged)
                                return (
                                    <div key={item.id}>
                                        <div className="relative">
                                            <div className="[&>[data-headlessui-state='open']]:bg-theme-secondary/10 [&>[data-headlessui-state='open']]:ring-1 flex flex-col gap-2 border-theme-secondary/10 w-full rounded-2xl border p-0 hover:border-theme-secondary/20 hover:bg-theme-secondary/[0.02] [&>[data-headlessui-state='open']]:ring-theme-secondary/20">
                                                <div
                                                    data-headlessui-state={isMenuExpanded(item.id) ? "open" : ""}
                                                    className="relative flex w-full flex-col rounded-2xl transition-all"
                                                >
                                                    <div
                                                        className="flex items-center justify-between gap-2 pr-4 transition duration-75 cursor-pointer"
                                                        onClick={() => toggleMenu(item.id)}
                                                    >
                                                        <a
                                                            href={item.href}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 max-w-full text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 rounded-lg gap-4 inline-flex items-center justify-center flex-1 py-4 pl-4 text-sm font-bold !leading-tight transition-all lg:text-xs"
                                                        >
                                                            <span className="flex w-full items-center gap-2 text-left">
                                                                <img src={item.image} alt={item.name} className="h-5 w-5" />
                                                                <span className={`uppercase ${menuTextColor}`}>
                                                                    {item.name}
                                                                </span>
                                                            </span>
                                                        </a>

                                                        <svg
                                                            className={`iconify iconify--tabler bg-theme-secondary-300/10 h-6 w-6 rounded p-1 text-theme-secondary transition-transform duration-200 ${
                                                                isMenuExpanded(item.id) ? "rotate-180" : ""
                                                            }`}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="m6 9l6 6l6-6"
                                                            />
                                                        </svg>
                                                    </div>

                                                    <div
                                                        style={{ display: isMenuExpanded(item.id) ? "block" : "none" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="rounded-b-2xl bg-transparent font-normal !leading-tight border-0 text-base text-primary-100 p-0">
                                                            <div className="flex flex-col gap-1 px-2 pb-2 pt-1">
                                                                {item.subItems.map((sub) => (
                                                                    <div key={sub.href}>
                                                                        <div className="relative">
                                                                            <div className="relative flex">
                                                                                <div className="relative inline-flex items-center justify-center flex-shrink-0 w-full">
                                                                                    <a
                                                                                        href={sub.href}
                                                                                        className={`hover:bg-theme-secondary/5 justify-between overflow-hidden rounded-xl px-4 py-3 text-base font-normal !leading-tight text-white lg:text-sm h-[3.25rem] hover:text-white flex w-full items-center gap-2 ${
                                                                                            activeSubmenuItem === sub.code ||
                                                                                            location.hash.slice(1) === sub.href.split("#")[1]
                                                                                                ? "bg-theme-secondary/10"
                                                                                                : ""
                                                                                        }`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="relative block">{sub.name}</span>
                                                                                            {sub.name === "Juegos de Crash" && (
                                                                                                <span className="inline-flex items-center ring-primary-500 font-semibold rounded-[2.5rem] !leading-tight px-1.5 py-0.5 text-[0.625rem] leading-[normal] gap-0.5 text-dark-grey-900 bg-theme-secondary">
                                                                                                    POPULARES
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Popover Portal */}
            {isPopoverVisible && hoveredMenu && !isSidebarExpanded && (
                <div
                    ref={popoverRef}
                    className="fixed z-[100] min-w-[15rem] transition-opacity duration-200"
                    style={{
                        top: `${popoverPosition.top}px`,
                        left: `${popoverPosition.left}px`,
                    }}
                    onMouseEnter={handlePopoverMouseEnter}
                    onMouseLeave={handlePopoverMouseLeave}
                >
                    <div className="overflow-hidden focus:outline-none relative flex flex-col gap-1 p-4 bg-theme-primary-950 ring-theme-secondary/10 ring-1 rounded-2xl shadow-2xl">
                        {/* Main Title */}
                        <a
                            href={menuItems.find(item => item.id === hoveredMenu)?.href}
                            className="text-theme-secondary-50 relative flex items-center justify-between pb-2 text-lg font-bold uppercase after:bg-theme-secondary/0 after:absolute after:bottom-0 after:h-px after:w-full hover:after:bg-theme-secondary hover:text-white hover:after:h-0.5 transition-all"
                        >
                            <span>{menuItems.find(item => item.id === hoveredMenu)?.name}</span>
                        </a>

                        {/* Sub Items */}
                        {menuItems.find(item => item.id === hoveredMenu)?.subItems.map((sub) => (
                            <a
                                key={sub.href}
                                href={sub.href}
                                className="hover:bg-theme-secondary/5 justify-between overflow-hidden rounded-xl px-4 py-3 text-base font-normal !leading-tight text-white lg:text-sm hover:text-white flex w-full items-center gap-2 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="relative block">{sub.name}</span>
                                    {sub.name === "Juegos de Crash" && (
                                        <span className="inline-flex items-center ring-primary-500 font-semibold rounded-[2.5rem] !leading-tight px-1.5 py-0.5 text-[0.625rem] leading-[normal] gap-0.5 text-dark-grey-900 bg-theme-secondary">
                                            POPULARES
                                        </span>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;