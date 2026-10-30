import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  // Match standard, short, embed, or shorts youtube links
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0` : null;
};

export const HomeFeaturedVideoBanner: React.FC = () => {
  const { homeFeaturedVideo } = useStore();
  const { language } = useLanguage();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!homeFeaturedVideo || !homeFeaturedVideo.enabled) {
    return null;
  }

  const title = language === 'ta' && homeFeaturedVideo.tamilTitle
    ? homeFeaturedVideo.tamilTitle
    : homeFeaturedVideo.title || 'Mara Chekku Heritage: The Live Wood Pressing Experience';

  const subtitle = language === 'ta' && homeFeaturedVideo.tamilSubtitle
    ? homeFeaturedVideo.tamilSubtitle
    : homeFeaturedVideo.subtitle || 'Watch how native seeds are crushed cold in Vaagai wood pestles without artificial heat or chemical solvents.';

  const isYouTube = homeFeaturedVideo.videoType === 'youtube' || (homeFeaturedVideo.videoUrl && (homeFeaturedVideo.videoUrl.includes('youtube.com') || homeFeaturedVideo.videoUrl.includes('youtu.be')));
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(homeFeaturedVideo.videoUrl) : null;

  const handlePlayToggle = () => {
    if (isYouTube) {
      setIsModalOpen(true);
      return;
    }
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#fbf8f2] via-stone-50 to-[#f6f2e9] relative overflow-hidden border-y border-stone-200/70">
      {/* Decorative Warm Backlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-stone-900 tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Video Card Container - Compact & Centered */}
        <div className="relative max-w-2xl sm:max-w-3xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-stone-200/90 bg-black group">
          
          {/* Main Video Viewport (16:9 Aspect Ratio) */}
          <div className="relative w-full aspect-video flex items-center justify-center bg-black overflow-hidden">
            
            {isYouTube && youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={homeFeaturedVideo.videoUrl || '/videos/reel_1.mp4'}
                  poster={homeFeaturedVideo.posterUrl || '/products/sesame_oil.jpg'}
                  playsInline
                  loop
                  muted={isMuted}
                  autoPlay={homeFeaturedVideo.autoplay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={handlePlayToggle}
                />

                {/* Vignette Overlay when paused */}
                {!isPlaying && (
                  <div
                    onClick={handlePlayToggle}
                    className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-all flex items-center justify-center cursor-pointer group-hover:bg-black/35"
                  >
                    {/* Big Gold Play Button */}
                    <button
                      type="button"
                      aria-label="Play Video"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all pl-1.5 cursor-pointer ring-8 ring-white/20 group-hover:ring-amber-400/40"
                    >
                      <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current text-forest-950" />
                    </button>
                  </div>
                )}

                {/* Floating Bottom Controls (For Native Video) */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between text-white pointer-events-none z-20">
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      onClick={handlePlayToggle}
                      className="px-3.5 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-xs border border-white/20 cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleMuteToggle}
                      className="w-8 h-8 rounded-xl bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all backdrop-blur-xs border border-white/20 cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-xs border border-white/20 cursor-pointer"
                      title="Fullscreen Lightbox"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Full View</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>

      {/* Full View Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
            <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-100">{title}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-video bg-black">
              {isYouTube && youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={homeFeaturedVideo.videoUrl || '/videos/reel_1.mp4'}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

