import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Search, 
  ChevronLeft, 
  List, 
  Info, 
  Volume2, 
  Maximize2, 
  Clock,
  Tv,
  Flame,
  Sparkles,
  X,
  ArrowRight
} from 'lucide-react';
import { youtubeService, type YouTubeVideo, type YouTubePlaylist } from './services/youtubeService';

export default function App() {
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<YouTubePlaylist | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [episodeSearchQuery, setEpisodeSearchQuery] = useState('');
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recentlyWatched, setRecentlyWatched] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    loadInitialPlaylists();
    const saved = localStorage.getItem('recentlyWatched');
    if (saved) setRecentlyWatched(JSON.parse(saved));
  }, []);

  const loadInitialPlaylists = async () => {
    setLoading(true);
    const data = await youtubeService.searchAnimePlaylists('official anime full episodes');
    setPlaylists(data);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const data = await youtubeService.searchAnimePlaylists(`${searchQuery} anime`);
    setPlaylists(data);
    setIsSearching(false);
  };

  const handlePlaylistSelect = async (playlist: YouTubePlaylist) => {
    setSelectedPlaylist(playlist);
    setLoading(true);
    setEpisodeSearchQuery('');
    const data = await youtubeService.getPlaylistVideos(playlist.id);
    setVideos(data);
    if (data.length > 0) {
      setCurrentVideo(data[0]);
    }
    setLoading(false);
  };

  const addToRecentlyWatched = (video: YouTubeVideo) => {
    const updated = [video, ...recentlyWatched.filter(v => v.id !== video.id)].slice(0, 5);
    setRecentlyWatched(updated);
    localStorage.setItem('recentlyWatched', JSON.stringify(updated));
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    setCurrentVideo(video);
    addToRecentlyWatched(video);
  };

  const closePlayer = () => {
    setSelectedPlaylist(null);
    setCurrentVideo(null);
    setVideos([]);
    setEpisodeSearchQuery('');
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(episodeSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative">
      <div className="atmosphere" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass border-b-0 bg-black/20">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <Tv className="w-8 h-8 text-[#ff4e00]" />
          <h1 className="text-2xl font-black tracking-tighter italic uppercase">ANDREAD STREAM</h1>
        </div>

        <form onSubmit={handleSearch} className="relative hidden md:block w-96">
          <input
            type="text"
            placeholder="Search anime series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-10 focus:outline-none focus:border-[#ff4e00] transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
        </form>

        <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff4e00] to-orange-400 border-2 border-white/10 shadow-lg" />
        </div>
      </nav>

      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedPlaylist ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="relative aspect-video rounded-[2rem] md:rounded-[4rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/5">
                <img 
                  src="https://picsum.photos/seed/anime-epic-v2/1920/1080" 
                  alt="Hero" 
                  className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-[#0a0502]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0502] via-[#0a0502]/60 to-transparent" />
                
                <div className="absolute bottom-6 left-6 md:bottom-20 md:left-20 right-6 md:max-w-5xl space-y-4 md:space-y-10">
                  <motion.div 
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 md:gap-6 text-[#ff4e00]"
                  >
                    <div className="h-[2px] md:h-[3px] w-12 md:w-24 bg-gradient-to-r from-[#ff4e00] to-transparent rounded-full" />
                    <span className="text-[10px] md:text-base font-black uppercase tracking-[0.4em] md:tracking-[0.6em] drop-shadow-2xl">Cinematic Streaming</span>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                    className="text-4xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[0.8] md:leading-[0.75] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  >
                    YOUR ANIME <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4e00] via-orange-500 to-yellow-400">MULTIVERSE</span>
                  </motion.h2>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                    className="flex items-center gap-4 md:gap-10 pt-2 md:pt-8"
                  >
                    <button className="group/btn bg-[#ff4e00] text-white px-6 py-3 md:px-16 md:py-7 rounded-full font-black flex items-center gap-2 md:gap-5 hover:bg-white hover:text-black transition-all duration-700 hover:scale-105 shadow-[0_0_60px_rgba(255,78,0,0.5)] active:scale-95 text-xs md:text-lg">
                      <Play className="w-4 h-4 md:w-8 md:h-8 fill-current group-hover/btn:scale-125 transition-transform duration-500" /> 
                      <span className="tracking-[0.1em] md:tracking-[0.2em]">START JOURNEY</span>
                    </button>
                    <button className="glass px-6 py-3 md:px-16 md:py-7 rounded-full font-black hover:bg-white/20 transition-all duration-700 border-white/10 tracking-[0.1em] md:tracking-[0.2em] text-xs md:text-lg hover:scale-105 active:scale-95">
                      DISCOVER
                    </button>
                  </motion.div>
                </div>
              </section>

              {/* Home Page Search Section */}
              <section className="max-w-6xl mx-auto -mt-10 md:-mt-20 relative z-10 px-4 md:px-8">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-[#ff4e00] via-orange-500 to-yellow-500 rounded-full blur-xl opacity-15 group-hover:opacity-30 transition duration-1000 group-hover:duration-500"></div>
                  <div className="relative flex items-center glass rounded-full p-2 md:p-3 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-[50px]">
                    <div className="pl-4 md:pl-10 pr-2 md:pr-6">
                      <Search className="w-5 h-5 md:w-8 md:h-8 text-white/20 group-focus-within:text-[#ff4e00] transition-all duration-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search anime..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none py-3 md:py-6 text-sm md:text-2xl focus:outline-none placeholder:text-white/10 font-bold tracking-tight text-white"
                    />
                    <button 
                      type="submit"
                      className="bg-[#ff4e00] hover:bg-white hover:text-black text-white p-3 md:p-6 rounded-full font-black transition-all duration-700 shadow-2xl group/search active:scale-90"
                    >
                      <ArrowRight className="w-5 h-5 md:w-10 md:h-10 group-hover/search:translate-x-2 transition-transform duration-500" />
                    </button>
                  </div>
                </form>
              </section>

              {/* Recently Watched */}
              {recentlyWatched.length > 0 && (
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-[#ff4e00]" />
                    <h3 className="text-3xl font-black tracking-tighter uppercase">Recently Watched</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentlyWatched.map((video) => (
                      <motion.div
                        key={video.id}
                        whileHover={{ scale: 1.05, y: -8 }}
                        className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer glass border-white/5 shadow-lg"
                        onClick={() => {
                          setCurrentVideo(video);
                          setSelectedPlaylist({ id: '', title: 'Recently Watched', thumbnail: video.thumbnail, videoCount: 0 });
                          setVideos([video]);
                        }}
                      >
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-xs font-black line-clamp-2 leading-tight group-hover:text-[#ff4e00] transition-colors">{video.title}</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[1px]">
                          <div className="bg-[#ff4e00] p-3 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 fill-current text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Playlists Grid */}
              <section className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#ff4e00]/10 rounded-xl">
                      <Flame className="w-8 h-8 text-[#ff4e00]" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter uppercase">Multiverse Collections</h3>
                      <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">Curated for you</p>
                    </div>
                  </div>
                  <button className="glass px-6 py-2 rounded-full text-xs font-black tracking-widest hover:bg-white hover:text-black transition-all">VIEW ALL</button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-video rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {playlists.map((playlist) => (
                      <motion.div
                        key={playlist.id}
                        whileHover={{ y: -16, scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="group relative aspect-video rounded-[2.5rem] overflow-hidden cursor-pointer glass border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
                        onClick={() => handlePlaylistSelect(playlist)}
                      >
                        <img 
                          src={playlist.thumbnail} 
                          alt={playlist.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-[#0a0502]/20 to-transparent opacity-90" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center gap-3">
                            <span className="bg-[#ff4e00] w-2 h-2 rounded-full shadow-[0_0_10px_#ff4e00]" />
                            <span className="text-xs font-black tracking-[0.3em] text-white/60 uppercase">Multiverse</span>
                          </div>
                          <h4 className="font-black text-2xl leading-tight line-clamp-2 group-hover:text-[#ff4e00] transition-colors duration-500">
                            {playlist.title}
                          </h4>
                          <div className="flex items-center gap-4 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              <Play className="w-3 h-3" /> Watch Now
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 bg-black/40 backdrop-blur-[4px]">
                          <div className="bg-[#ff4e00] p-6 rounded-full shadow-[0_0_50px_rgba(255,78,0,0.6)] transform scale-50 group-hover:scale-100 transition-transform duration-500 ease-out">
                            <Play className="w-10 h-10 fill-current text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Main Player Area */}
              <div className="lg:col-span-2 space-y-6">
                <button 
                  onClick={closePlayer}
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4"
                >
                  <ChevronLeft className="w-5 h-5" /> Back to Home
                </button>

                <div className="video-aspect rounded-3xl overflow-hidden glass shadow-2xl relative group">
                  {currentVideo ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&modestbranding=1&rel=0`}
                      title={currentVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff4e00]"></div>
                    </div>
                  )}
                  
                  {/* Custom Overlay for Play/Pause visibility */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md p-6 rounded-full border border-white/10">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-bold tracking-tight">{currentVideo?.title}</h2>
                      <p className="text-[#ff4e00] font-medium">{selectedPlaylist.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 rounded-full glass hover:bg-white/10 transition-all">
                        <Clock className="w-5 h-5" />
                      </button>
                      <button className="p-3 rounded-full glass hover:bg-white/10 transition-all">
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed max-w-3xl">
                    {currentVideo?.description || "No description available for this episode."}
                  </p>
                </div>
              </div>

              {/* Sidebar Playlist */}
              <div className="space-y-6">
                <div className="glass rounded-[2rem] p-8 h-[calc(100vh-12rem)] flex flex-col border-white/5 shadow-2xl">
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black tracking-tighter uppercase">Episodes</h3>
                      <span className="bg-[#ff4e00]/20 text-[#ff4e00] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                        {filteredVideos.length} Available
                      </span>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search episodes..."
                        value={episodeSearchQuery}
                        onChange={(e) => setEpisodeSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-12 focus:outline-none focus:border-[#ff4e00] transition-all text-sm"
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      {episodeSearchQuery && (
                        <button 
                          onClick={() => setEpisodeSearchQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {filteredVideos.length > 0 ? (
                      filteredVideos.map((video) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => handleVideoSelect(video)}
                          className={`group flex gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                            currentVideo?.id === video.id 
                              ? 'bg-[#ff4e00]/10 border-[#ff4e00]/40 shadow-[0_0_20px_rgba(255,78,0,0.1)]' 
                              : 'hover:bg-white/5 border-transparent'
                          }`}
                        >
                          <div className="relative w-28 aspect-video rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {currentVideo?.id === video.id && (
                              <div className="absolute inset-0 bg-[#ff4e00]/40 flex items-center justify-center backdrop-blur-[2px]">
                                <Play className="w-6 h-6 fill-current text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-center overflow-hidden">
                            <h5 className={`text-sm font-bold line-clamp-2 leading-tight transition-colors ${
                              currentVideo?.id === video.id ? 'text-[#ff4e00]' : 'text-white/90 group-hover:text-white'
                            }`}>
                              {video.title}
                            </h5>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-1 h-1 rounded-full bg-[#ff4e00]" />
                              <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black">
                                Official
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
                        <Search className="w-12 h-12 opacity-20" />
                        <p className="text-sm font-medium">No episodes found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 mt-12 glass">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Tv className="w-6 h-6 text-[#ff4e00]" />
            <span className="text-xl font-bold tracking-tighter italic uppercase">ANDREAD STREAM</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-white/20">© 2024 Andread Stream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
