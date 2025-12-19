import { useContext } from "react";
import { AppContext } from "../AppContext";
import { useLocation } from "react-router-dom";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ImgLogoTransparent from "/src/assets/svg/logo-transparent.svg";

const ProviderContainer = ({
    categories,
    selectedProvider,
    onProviderSelect
}) => {
    const { contextData } = useContext(AppContext);
    const location = useLocation();

    const providers = categories.filter(cat => cat.code && cat.code !== "home");

    const handleClick = (e, provider) => {
        e.preventDefault();
        onProviderSelect(provider);
    };

    const isSelected = (provider) => {
        const hashCode = location.hash.substring(1);
        return (selectedProvider && selectedProvider.id === provider.id) ||
            (hashCode === provider.code);
    };

    return (
        <div className="relative mb-3 py-2 lg:py-3">
            <div className="absolute inset-0 h-[calc(100%_-_2rem)] w-full opacity-50 [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,white_40%,white_60%,transparent),linear-gradient(to_bottom,transparent,white_40%,white_60%,transparent)] lg:h-[calc(100%_-_5rem)]" />
            <div className="relative mb-3 flex items-center justify-between gap-2 py-4">
                <img
                    src={ImgLogoTransparent}
                    alt="fortunajuegos"
                    className="absolute left-0 top-0.5 h-auto w-[4.25rem] opacity-50"
                />

                <h1 className="text-dark-grey-50 text-xs font-bold !leading-tight tracking-[1.2px] sm:text-sm sm:leading-[1.1]">
                    Proveedores
                </h1>

                <a
                    href="/es/proveedores"
                    className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full text-ellipsis ring-0 focus-visible:outline-0 font-bold rounded-lg text-base gap-3 px-4 py-3 text-theme-secondary-500 bg-theme-secondary-500/10 disabled:bg-theme-secondary-500/10 disabled:text-theme-secondary-500 disabled:opacity-30 focus-visible:ring-theme-secondary-500 focus-visible:ring-2 focus-visible:ring-inset focus:outline-theme-secondary-500/10 focus:bg-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-500/20 inline-flex items-center justify-center min-h-10"
                >
                    Ver todo
                </a>
            </div>
            <div className="relative w-full pb-6">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={8}
                    loop={true}
                    navigation={{
                        prevEl: '.swiper-button-prev',
                        nextEl: '.swiper-button-next',
                    }}
                    grabCursor={true}
                    className="scroll-snap-slider transform-gpu"
                    style={{ pointerEvents: 'auto' }}
                >
                    {providers.map((provider) => {
                        const selected = isSelected(provider);
                        const imageUrl = provider.image_local
                            ? `${contextData.cdnUrl}${provider.image_local}`
                            : provider.image_url;

                        return (
                            <SwiperSlide
                                key={provider.id}
                                className="!w-32 !h-auto lg:!min-w-32 lg:shrink-0"
                            >
                                <div
                                    className={`
                                        bg-theme-secondary/10 ease-elastic-out relative flex h-auto min-h-16 w-full
                                        flex-col items-center justify-between gap-1 rounded-xl border border-transparent
                                        p-2 transition-colors duration-300 hover:bg-theme-secondary/20
                                        hover:border-theme-secondary/20 ${selected ? 'ring-2 ring-theme-secondary' : ''}
                                    `}
                                    onClick={(e) => handleClick(e, provider)}
                                >
                                    <div className="flex aspect-[2/1] max-h-12 w-full max-w-24 items-center justify-center">
                                        {imageUrl ? (
                                            <picture className="contents">
                                                <img
                                                    src={imageUrl}
                                                    alt={provider.name}
                                                    className="object-contain"
                                                    loading="lazy"
                                                />
                                            </picture>
                                        ) : null}
                                    </div>

                                    <span className="
                                        inline-flex items-center font-normal rounded-md px-2 py-1 text-xs
                                        !leading-tight gap-0.5 ring-inset bg-dark-grey-900 text-white ring-1
                                        ring-dark-grey-700 self-start
                                    ">
                                        <span>{provider.element_count} Juegos</span>
                                    </span>

                                    <a
                                        href={`/es/proveedores/${provider.name}`}
                                        className="absolute inset-0"
                                        title={provider.name}
                                        aria-label={`Ver juegos de ${provider.name}`}
                                    />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </div>
    );
};

export default ProviderContainer;