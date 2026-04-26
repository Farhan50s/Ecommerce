import React, { useState, useRef, useCallback, useEffect } from 'react';
import './ProductMediaViewer.css';

/* ─── Gallery Mode ─────────────────────────────────────── */
const GalleryMode = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef(null);

  const goTo = useCallback((index) => {
    if (index === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 260);
    }, 20);
  }, [activeIndex, isTransitioning]);

  const prev = () => goTo((activeIndex - 1 + images.length) % images.length);
  const next = () => goTo((activeIndex + 1) % images.length);

  /* Lightbox Navigation */
  const lbPrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIdx) => (prevIdx - 1 + images.length) % images.length);
  };
  const lbNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIdx) => (prevIdx + 1) % images.length);
  };

  /* Keyboard arrows */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') isLightboxOpen ? setActiveIndex(i => (i - 1 + images.length) % images.length) : prev();
      if (e.key === 'ArrowRight') isLightboxOpen ? setActiveIndex(i => (i + 1) % images.length) : next();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, isLightboxOpen, prev, next]);

  return (
    <>
      <div className="media-viewer__display" ref={containerRef}>
        {/* Main image clickable */}
        <div 
          className="gallery__main-image-wrapper" 
          onClick={() => setIsLightboxOpen(true)}
          title="Click to enlarge"
        >
          <img
            src={images[activeIndex]}
            alt={`Product photo ${activeIndex + 1}`}
            className={`gallery__main-image ${isTransitioning ? 'gallery__main-image--entering' : 'gallery__main-image--visible'}`}
            draggable={false}
          />
        </div>

        {/* Arrows on main display */}
        {images.length > 1 && (
          <>
            <button className="gallery__arrow gallery__arrow--left" onClick={prev} aria-label="Previous image">‹</button>
            <button className="gallery__arrow gallery__arrow--right" onClick={next} aria-label="Next image">›</button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="gallery__thumbnails">
          {images.map((src, i) => (
            <button
              key={i}
              className={`gallery__thumb-btn ${i === activeIndex ? 'gallery__thumb-btn--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt={`Thumbnail ${i + 1}`} className="gallery__thumb-img" draggable={false} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="lightbox" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox__content" onClick={e => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setIsLightboxOpen(false)} aria-label="Close lightbox">×</button>
            
            <button className="lightbox__arrow lightbox__arrow--left" onClick={lbPrev}>‹</button>
            
            <div className="lightbox__frame">
              <img src={images[activeIndex]} alt="Product enlargement" className="lightbox__image" />
            </div>

            <button className="lightbox__arrow lightbox__arrow--right" onClick={lbNext}>›</button>
            
            <div className="lightbox__counter">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ─── 360° Viewer Mode ─────────────────────────────────── */
const Viewer360 = ({ frames }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const dragRef = useRef({ 
    isDragging: false, 
    startX: 0, 
    currentX: 0,
    lastX: 0,
    velocity: 0,
    currRotation: 0,
    targetRotation: 0,
    lastTime: performance.now()
  });
  const requestRef = useRef();

  const DRAG_SENSITIVITY = 0.5; // Controls rotation speed
  const FRICTION = 0.95; // Controls how fast inertia dies out
  const AUTO_ROTATE_SPEED = 0.2;

  // Preload frames
  useEffect(() => {
    frames.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [frames]);

  // Hide hint after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const updateFrame = useCallback((rotation) => {
    const totalFrames = frames.length;
    const idx = Math.floor(rotation) % totalFrames;
    setFrameIndex(idx < 0 ? idx + totalFrames : idx);
  }, [frames.length]);

  const animate = useCallback(() => {
    const state = dragRef.current;
    
    if (!state.isDragging) {
      // Apply auto-rotation if no interaction has happened yet, or apply inertia
      if (Math.abs(state.velocity) > 0.1) {
        state.currRotation += state.velocity;
        state.velocity *= FRICTION;
      } else if (showHint) {
        state.currRotation += AUTO_ROTATE_SPEED;
      }
      updateFrame(state.currRotation);
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [updateFrame, showHint]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  /* —— Mouse events —— */
  const handleMouseDown = (e) => {
    e.preventDefault();
    const state = dragRef.current;
    state.isDragging = true;
    state.startX = e.clientX;
    state.lastX = e.clientX;
    state.velocity = 0;
    setShowHint(false); // Interaction stops hint/auto-rotate
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = useCallback((e) => {
    const state = dragRef.current;
    if (!state.isDragging) return;
    
    const dx = e.clientX - state.lastX;
    state.velocity = dx * DRAG_SENSITIVITY;
    state.currRotation += state.velocity;
    state.lastX = e.clientX;
    
    updateFrame(state.currRotation);
  }, [updateFrame]);

  const handleGlobalMouseUp = useCallback(() => {
    const state = dragRef.current;
    state.isDragging = false;
    window.removeEventListener('mousemove', handleGlobalMouseMove);
    window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [handleGlobalMouseMove]);

  /* —— Touch events —— */
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const state = dragRef.current;
    state.isDragging = true;
    state.startX = touch.clientX;
    state.lastX = touch.clientX;
    state.velocity = 0;
    setShowHint(false);
  };

  const handleTouchMove = (e) => {
    const state = dragRef.current;
    if (!state.isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - state.lastX;
    state.velocity = dx * DRAG_SENSITIVITY;
    state.currRotation += state.velocity;
    state.lastX = touch.clientX;
    updateFrame(state.currRotation);
  };

  const handleTouchEnd = () => {
    dragRef.current.isDragging = false;
  };

  return (
    <div className="media-viewer__display">
      <div
        className={`viewer360 ${dragRef.current.isDragging ? 'viewer360--dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={frames[frameIndex]}
          alt={`360° view frame ${frameIndex + 1}`}
          className="viewer360__frame"
          draggable={false}
        />

        {showHint && (
          <div className="viewer360__hint">
            <div className="viewer360__hint-icon">↔</div>
            <span className="viewer360__hint-label">Drag to rotate</span>
          </div>
        )}

        <div className="viewer360__counter">
          Frame {frameIndex + 1} / {frames.length}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────── */
const ProductMediaViewer = ({ media }) => {
  const [activeTab, setActiveTab] = useState('gallery');

  if (!media) return null;

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  return (
    <div className="media-viewer">
      {/* Tab Bar */}
      <div className="media-viewer__tabs">
        <button
          className={`media-viewer__tab ${activeTab === 'gallery' ? 'media-viewer__tab--active' : ''}`}
          onClick={() => switchTab('gallery')}
        >
          Photos
        </button>
        <button
          className={`media-viewer__tab ${activeTab === '360' ? 'media-viewer__tab--active' : ''}`}
          onClick={() => switchTab('360')}
        >
          360° View
          <span className="media-viewer__badge">360°</span>
        </button>
      </div>

      {/* Active Viewer */}
      {activeTab === 'gallery'
        ? <GalleryMode key="gallery" images={media.gallery} />
        : <Viewer360 key="360" frames={media.frames360} />
      }
    </div>
  );
};

export default ProductMediaViewer;
