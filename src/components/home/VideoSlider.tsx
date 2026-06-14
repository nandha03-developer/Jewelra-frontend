'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeOff, X } from 'lucide-react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const videos = [
    'https://res.cloudinary.com/dtusyew0a/video/upload/v1775455083/Slider_Video_1_ctttku.mp4',
    'https://res.cloudinary.com/dtusyew0a/video/upload/v1775455093/Slider_Video_2_xaexaf.mp4',
    'https://res.cloudinary.com/dtusyew0a/video/upload/v1775455084/Slider_Video_3_ppqpvv.mp4',
    'https://res.cloudinary.com/dtusyew0a/video/upload/v1775455084/Slider_Video_4_kp91pg.mp4',
    'https://res.cloudinary.com/dtusyew0a/video/upload/v1775455093/Slider_Video_5_n1rwht.mp4',
];

export default function VideoSlider() {
    const [index, setIndex] = useState(0);
    const len = videos.length;
    const [cardSize, setCardSize] = useState({ width: 350, height: 555 });
    const [isPlaying, setIsPlaying] = useState<boolean[]>(Array(videos.length).fill(false));
    const videoRefs = useRef<(HTMLVideoElement | null)[]>(Array(videos.length).fill(null));
    const modalVideoRef = useRef<HTMLVideoElement | null>(null);
    const [progress, setProgress] = useState<number[]>(Array(videos.length).fill(0));
    const [duration, setDuration] = useState<number[]>(Array(videos.length).fill(0));
    const [isMuted, setIsMuted] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProgress, setModalProgress] = useState(0);
    const [modalDuration, setModalDuration] = useState(0);
    const [isModalPlaying, setIsModalPlaying] = useState(false);
    const autoPlayNextRef = useRef<boolean>(true);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setCardSize({ width: 400, height: 300 });
            } else {
                setCardSize({ width: 362.43, height: 644.32 });
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const newProgress = [...progress];
        newProgress.fill(0);
        setProgress(newProgress);

        if (videoRefs.current[index]) {
            videoRefs.current[index]?.pause();
            videoRefs.current[index]?.load(); // Ensure the video is reloaded

            setTimeout(() => {
                videoRefs.current[index]?.play().catch(() => { });
                const newIsPlaying = [...isPlaying];
                newIsPlaying[index] = true;
                setIsPlaying(newIsPlaying);
            }, 100);
        }

        // Reset progress and duration for other videos
        const resetProgressAndDuration = [...progress];
        const resetDuration = [...duration];
        resetProgressAndDuration.fill(0);
        resetDuration.fill(0);
        setProgress(resetProgressAndDuration);
        setDuration(resetDuration);

        const currentVideoRef = videoRefs.current[index];
        return () => {
            currentVideoRef?.pause();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    useEffect(() => {
        const centerVideo = videoRefs.current[index];
        if (!centerVideo) return;

        const handleEnded = () => {
            autoPlayNextRef.current = true;
            next();
        };

        const handleTimeUpdate = () => {
            if (!centerVideo.paused) {
                const newProgress = [...progress];
                newProgress[index] = centerVideo.currentTime;
                setProgress(newProgress);
            }
        };

        const handleLoadedMetadata = () => {
            const newDuration = [...duration];
            newDuration[index] = centerVideo.duration;
            setDuration(newDuration);
        };

        const handlePlay = () => {
            const newIsPlaying = [...isPlaying];
            newIsPlaying[index] = true;
            setIsPlaying(newIsPlaying);
        };

        const handlePause = () => {
            const newIsPlaying = [...isPlaying];
            newIsPlaying[index] = false;
            setIsPlaying(newIsPlaying);
        };

        centerVideo.addEventListener('ended', handleEnded);
        centerVideo.addEventListener('timeupdate', handleTimeUpdate);
        centerVideo.addEventListener('loadedmetadata', handleLoadedMetadata);
        centerVideo.addEventListener('play', handlePlay);
        centerVideo.addEventListener('pause', handlePause);

        return () => {
            centerVideo.removeEventListener('ended', handleEnded);
            centerVideo.removeEventListener('timeupdate', handleTimeUpdate);
            centerVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
            centerVideo.removeEventListener('play', handlePlay);
            centerVideo.removeEventListener('pause', handlePause);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    const prev = () => {
        videoRefs.current[index]?.pause();
        autoPlayNextRef.current = false;
        const newIndex = (index - 1 + len) % len;
        setIndex(newIndex);
        setIsPlaying(Array(videos.length).fill(false));
    };

    const next = () => {
        videoRefs.current[index]?.pause();
        const newIndex = (index + 1) % len;
        setIndex(newIndex);
        autoPlayNextRef.current = true;
        setIsPlaying(Array(videos.length).fill(false));
    };

    const togglePlay = (videoIndex: number) => {
        const video = videoRefs.current[videoIndex];
        if (!video) return;
        const newIsPlaying = [...isPlaying];
        newIsPlaying[videoIndex] = !newIsPlaying[videoIndex];
        setIsPlaying(newIsPlaying);
        newIsPlaying[videoIndex] ? video.play() : video.pause();
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleModalPlay = () => {
        if (!modalVideoRef.current) return;
        if (modalVideoRef.current.paused) {
            modalVideoRef.current.play();
            setIsModalPlaying(true);
        } else {
            modalVideoRef.current.pause();
            setIsModalPlaying(false);
        }
    };

    const openModal = () => {
        videoRefs.current[index]?.pause();
        setIsModalPlaying(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsModalPlaying(false);
        if (isPlaying[index]) {
            videoRefs.current[index]?.play();
        }
    };

    const nextModalVideo = () => {
        const nextIndex = (index + 1) % len;
        setIndex(nextIndex);
        setModalProgress(0);
        setIsModalPlaying(true);
    };

    const getPositionStyles = (pos: number) => {
        switch (pos) {
            case -2:
                return { x: -250, scale: 0.6, rotateY: 45, opacity: 0.3, zIndex: 1, filter: 'brightness(0.7)' };
            case -1:
                return { x: -125, scale: 0.8, rotateY: 25, opacity: 0.6, zIndex: 3, filter: 'brightness(0.85)' };
            case 0:
                return { x: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 5, filter: 'brightness(1)' };
            case 1:
                return { x: 125, scale: 0.8, rotateY: -25, opacity: 0.6, zIndex: 3, filter: 'brightness(0.85)' };
            case 2:
                return { x: 250, scale: 0.6, rotateY: -45, opacity: 0.3, zIndex: 1, filter: 'brightness(0.7)' };
            default:
                return { display: 'none' };
        }
    };

    return (
        <div
            className="w-full flex flex-col items-center justify-center pt-16 pb-24 md:pb-32 mb-10 min-h-[400px] relative gap-8 bg-white"
        >
            <div className="text-center px-4">
                <div className="flex flex-col items-center gap-6">
                    {/* Compact Badge Style Heading */}
                    <div className="inline-flex flex-col items-center">
                        <div className="bg-[#E5D5C6]/30 px-6 py-2.5 rounded-full border border-[#E5D5C6]/50 backdrop-blur-sm shadow-sm">
                            <h1 className="italic font-serif normal-case tracking-normal text-3xl text-[#787373]">
                                Explore Handmade Jewellery
                            </h1>
                        </div>

                        {/* Soft Divider with Diamond Icon */}
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-[#2D1B1B]/20 to-transparent"></div>
                            <Icon icon="basil:diamond-outline" className="text-[#2D1B1B]/40" width="18" height="18" />
                            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent via-[#2D1B1B]/20 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative w-[800px] h-[555px] flex items-center justify-center perspective-1000 my-8">
                <button
                    onClick={prev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-200 hover:bg-gray-400 shadow z-20 hidden md:block"
                    aria-label="Previous"
                    suppressHydrationWarning
                >
                    <ChevronLeft size={24} />
                </button>

                {[-2, -1, 0, 1, 2].map((pos) => {
                    const videoIndex = (index + pos + len) % len;
                    const styles = getPositionStyles(pos);

                    return (
                        <motion.div
                            key={videoIndex}
                            className="absolute shadow-xl cursor-pointer select-none overflow-hidden shadow-gray-600/70"
                            style={{
                                width: cardSize.width,
                                height: cardSize.height,
                                ...styles,
                                transformStyle: 'preserve-3d',
                                transition: 'all 0.5s ease',
                                borderRadius: '15px',
                                boxShadow: '0 10px 15px -3px rgba(75, 85, 99, 0.7), 0 4px 6px -2px rgba(75, 85, 99, 0.6)',
                                border: '1px solid rgba(75, 85, 99, 0.3)'
                            }}
                            initial={false}
                            animate={{
                                x: styles.x,
                                scale: styles.scale,
                                rotateY: styles.rotateY,
                                opacity: styles.opacity,
                                zIndex: styles.zIndex,
                                filter: styles.filter,
                            }}
                            transition={{ duration: 0.6 }}
                            onClick={() => {
                                if (pos !== 0) setIndex(videoIndex);
                            }}
                        >
                            <div className="relative w-full h-full">
                                <video
                                    ref={(el) => { videoRefs.current[videoIndex] = el; }}
                                    src={videos[videoIndex]}
                                    className="w-full h-full object-cover"
                                    loop={false}
                                    muted={isMuted}
                                    playsInline
                                />

                                {/* White Progress Bar - Only show for center card */}
                                {pos === 0 && (
                                    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-90 p-2">
                                        <div className="relative w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-75"
                                                style={{
                                                    width: `${(progress[videoIndex] / (duration[videoIndex] || 1)) * 100}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Play/Pause and Volume controls for center only */}
                                {pos === 0 && (
                                    <>
                                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMute();
                                                }}
                                                className="p-2 rounded-full bg-black bg-opacity-60 text-white hover:bg-opacity-80 transition-all"
                                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                                                suppressHydrationWarning
                                            >
                                                {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
                                            </button>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePlay(videoIndex);
                                            }}
                                            className="absolute bottom-14 right-4 p-3 rounded-full bg-black bg-opacity-80 text-white hover:bg-opacity-100 transition-all z-10"
                                            aria-label={isPlaying[videoIndex] ? 'Pause' : 'Play'}
                                            suppressHydrationWarning
                                        >
                                            {isPlaying[videoIndex] ? <Pause size={24} /> : <Play size={24} />}
                                        </button>

                                        {/* Clickable area for full-screen */}
                                        <div
                                            className="absolute inset-0 z-[5] cursor-pointer"
                                            onClick={() => openModal()}
                                        />
                                    </>
                                )}
                            </div>
                        </motion.div>
                    );

                })}

                <button
                    onClick={next}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-200 hover:bg-gray-400 shadow z-20 hidden md:block"
                    aria-label="Next"
                    suppressHydrationWarning
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Full Screen Video Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xl flex items-center justify-center p-0 md:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-[380px] h-full h-[95vh] md:h-[85vh] overflow-hidden rounded-none md:rounded-[30px] shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black border border-white/5"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={index}
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    exit={{ y: '-100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <video
                                        ref={modalVideoRef}
                                        src={videos[index]}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted={isMuted}
                                        playsInline
                                        onTimeUpdate={() => setModalProgress(modalVideoRef.current?.currentTime || 0)}
                                        onLoadedMetadata={() => setModalDuration(modalVideoRef.current?.duration || 0)}
                                        onEnded={nextModalVideo}
                                    />

                                    {/* Top Controls Overlay */}
                                    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
                                        <div className="text-white max-w-[70%]">
                                            <h3 className="font-medium text-sm md:text-base leading-tight">Find the perfect diamond that makes you dazzle...</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMute();
                                                }}
                                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-md"
                                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                                                suppressHydrationWarning
                                            >
                                                {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    closeModal();
                                                }}
                                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-md"
                                                aria-label="Close"
                                                suppressHydrationWarning
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Middle Play/Pause Overlay Control */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center z-0 cursor-pointer"
                                        onClick={toggleModalPlay}
                                    >
                                        {!isModalPlaying && (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="p-5 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20"
                                            >
                                                <Play size={40} fill="white" />
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Bottom Content Area */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 pb-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                        {/* Progress bar Container */}
                                        <div className="w-full">
                                            {/* Progress track */}
                                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-white transition-all duration-75"
                                                    style={{ width: `${(modalProgress / (modalDuration || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-6 flex space-x-6 md:hidden">
                <button
                    onClick={prev}
                    className="p-3 rounded-full bg-gray-200 hover:bg-gray-400 shadow"
                    aria-label="Previous"
                    suppressHydrationWarning
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={next}
                    className="p-3 rounded-full bg-gray-200 hover:bg-gray-400 shadow"
                    aria-label="Next"
                    suppressHydrationWarning
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}