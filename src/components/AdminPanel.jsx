import React, { useState } from 'react';
import { useCountdown, BUTTON_IMAGES } from '../context/CountdownContext';
import {
  Play,
  Pause,
  RotateCcw,
  Utensils,
  Coffee,
  CheckCircle2,
  Film,
  Zap,
  Megaphone,
  Clock,
  Volume2,
  VolumeX,
  XCircle,
  Plus,
  Minus,
  Sparkles,
  ExternalLink,
  Clapperboard,
  Sliders,
  ArrowUpCircle
} from 'lucide-react';
import AlertOverlay from './AlertOverlay';
import PopupImageOverlay from './PopupImageOverlay';

export default function AdminPanel() {
  const {
    remainingTimeMs,
    totalDurationMs,
    isRunning,
    activeAlert,
    activePopupImage,
    soundEnabled,
    shotCount,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustTime,
    setExactTime,
    triggerAlert,
    dismissAlert,
    triggerPopupImage,
    dismissPopupImage,
    toggleSound,
  } = useCountdown();

  // Custom alert form
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customDurationMins, setCustomDurationMins] = useState(15);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Exact time setter
  const [inputHours, setInputHours] = useState(24);
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [showTimeAdjustModal, setShowTimeAdjustModal] = useState(false);

  // Clean English Preset Announcements
  const presets = [
    {
      id: 'lunch',
      title: 'LUNCH BREAK',
      subtitle: 'Enjoy your meal and recharge! Food is served in the main dining hall.',
      type: 'lunch',
      theme: 'gold',
      durationMinutes: 45,
      icon: Utensils,
      color: '#f59e0b',
      badge: '45m Duration',
    },
    {
      id: 'refreshment',
      title: 'REFRESHMENT BREAK',
      subtitle: 'Grab hot coffee, energy drinks, and fresh snacks at the hospitality counter.',
      type: 'refreshment',
      theme: 'emerald',
      durationMinutes: 20,
      icon: Coffee,
      color: '#10b981',
      badge: '20m Duration',
    },
    {
      id: 'review',
      title: 'MENTOR REVIEW TIME',
      subtitle: 'Review Round is active! Prepare your architecture diagrams, codebase, and live demo.',
      type: 'review',
      theme: 'purple',
      durationMinutes: null,
      icon: CheckCircle2,
      color: '#a855f7',
      badge: 'Review Active',
    },
    {
      id: 'rush',
      title: 'FINAL CODING RUSH',
      subtitle: 'Final sprint before repository freeze! Commit and deploy your builds now!',
      type: 'rush',
      theme: 'rose',
      durationMinutes: null,
      icon: Zap,
      color: '#f43f5e',
      badge: 'Sprint Mode',
    },
  ];

  const formatTime = (ms) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    triggerAlert({
      type: 'custom',
      title: customTitle.trim().toUpperCase(),
      subtitle: customSubtitle.trim() || 'Official announcement from the Devforge organizing team.',
      durationMinutes: Number(customDurationMins) || 15,
      theme: 'gold',
    });

    setCustomTitle('');
    setCustomSubtitle('');
    setShowCustomModal(false);
  };

  const handleApplyCustomTime = (e) => {
    e.preventDefault();
    setExactTime(Number(inputHours), Number(inputMinutes), Number(inputSeconds));
    setShowTimeAdjustModal(false);
  };

  return (
    <div className="admin-wrapper kollywood-admin-theme">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-badge">
            <Clapperboard size={20} className="cinema-clapper-icon" />
            <span>DEVFORGE ADMIN CONTROL PANEL</span>
          </div>
          <span className="admin-subtitle">Live Stage Clapperboard Synchronizer • Take: #{shotCount}</span>
        </div>

        <div className="admin-header-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-secondary-btn"
            title="Open Countdown Stage in New Window/Display"
          >
            <ExternalLink size={16} />
            <span>Open Stage Screen</span>
          </a>

          <button
            onClick={toggleSound}
            className={`admin-icon-btn ${soundEnabled ? 'active' : ''}`}
            title={soundEnabled ? 'Mute Alert Audio' : 'Enable Alert Audio'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="admin-container">
        {/* Master Controls Card */}
        <div className="admin-card master-controls-card">
          <div className="card-top-row">
            <div>
              <span className="card-tag">MASTER TIMER</span>
              <h2 className="card-title">24-Hour Clapperboard Countdown</h2>
            </div>

            <div className={`status-pill ${isRunning ? 'status-live' : remainingTimeMs === 0 ? 'status-ended' : 'status-paused'}`}>
              <span className="status-indicator-dot"></span>
              <span>{isRunning ? 'RUNNING' : remainingTimeMs === 0 ? 'EXPIRED' : 'PAUSED'}</span>
            </div>
          </div>

          {/* Big Digital Display */}
          <div className="admin-timer-display">
            <span className="admin-timer-numbers">{formatTime(remainingTimeMs)}</span>
            <span className="admin-timer-sub">Total Duration: {formatTime(totalDurationMs)} • Take: #{shotCount}</span>
          </div>

          {/* Master Buttons */}
          <div className="master-btn-row">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="action-btn btn-action-start"
                title="Start or Resume Countdown"
              >
                <Play size={22} fill="currentColor" />
                <span>START COUNTDOWN</span>
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="action-btn btn-pause"
                title="Pause Countdown"
              >
                <Pause size={22} fill="currentColor" />
                <span>PAUSE</span>
              </button>
            )}

            <button
              onClick={() => resetTimer(24 * 60 * 60 * 1000)}
              className="action-btn btn-reset"
              title="Reset timer to default 24:00:00"
            >
              <RotateCcw size={18} />
              <span>RESET (24H)</span>
            </button>

            <button
              onClick={() => setShowTimeAdjustModal(true)}
              className="action-btn btn-sliders"
              title="Set Custom Duration"
            >
              <Sliders size={18} />
              <span>SET DURATION</span>
            </button>
          </div>

          {/* Quick Adjust */}
          <div className="quick-adjust-bar">
            <span className="adjust-label">Quick Adjust:</span>
            <div className="adjust-pill-group">
              <button onClick={() => adjustTime(-60 * 60 * 1000)} className="adjust-chip" title="Subtract 1 Hour">
                <Minus size={12} /> 1h
              </button>
              <button onClick={() => adjustTime(-15 * 60 * 1000)} className="adjust-chip" title="Subtract 15 Minutes">
                <Minus size={12} /> 15m
              </button>
              <button onClick={() => adjustTime(-5 * 60 * 1000)} className="adjust-chip" title="Subtract 5 Minutes">
                <Minus size={12} /> 5m
              </button>
              <button onClick={() => adjustTime(5 * 60 * 1000)} className="adjust-chip" title="Add 5 Minutes">
                <Plus size={12} /> 5m
              </button>
              <button onClick={() => adjustTime(15 * 60 * 1000)} className="adjust-chip" title="Add 15 Minutes">
                <Plus size={12} /> 15m
              </button>
              <button onClick={() => adjustTime(60 * 60 * 1000)} className="adjust-chip" title="Add 1 Hour">
                <Plus size={12} /> 1h
              </button>
            </div>
          </div>
        </div>

        {/* Active Announcement Banner */}
        {activeAlert && (
          <div className="admin-active-alert-banner">
            <div className="active-alert-left">
              <div className="pulsing-alert-ring"></div>
              <div>
                <span className="active-alert-label">LIVE STAGE ANNOUNCEMENT</span>
                <h3 className="active-alert-title">{activeAlert.title}</h3>
                <p className="active-alert-sub">{activeAlert.subtitle}</p>
              </div>
            </div>

            <button
              onClick={dismissAlert}
              className="dismiss-banner-btn"
              title="Dismiss announcement from stage screen"
            >
              <XCircle size={18} />
              <span>Dismiss Stage Alert</span>
            </button>
          </div>
        )}

        {/* Active Popup Image Banner */}
        {activePopupImage && (
          <div className="admin-active-popup-banner">
            <div className="active-popup-left">
              <img
                src={activePopupImage.image}
                alt="Active Popup"
                className="active-popup-thumb"
              />
              <div>
                <span className="active-alert-label">LIVE STAGE STICKER (ON SCREEN)</span>
                <h3 className="active-alert-title">{activePopupImage.title}</h3>
                <p className="active-alert-sub">{activePopupImage.subtitle}</p>
              </div>
            </div>

            <button
              onClick={dismissPopupImage}
              className="dismiss-banner-btn"
              title="Dismiss image from stage screen"
            >
              <XCircle size={18} />
              <span>Dismiss Stage Image</span>
            </button>
          </div>
        )}

        {/* Break & Event Announcement Triggers */}
        <div className="admin-card">
          <div className="card-top-row">
            <div>
              <span className="card-tag">STAGE ANNOUNCEMENTS & BREAKS</span>
              <h2 className="card-title">Quick Action Buttons</h2>
              <p className="card-desc">
                Click any button to trigger an animated announcement overlay, sound chime, and break timer on the countdown page.
              </p>
            </div>

            <button
              onClick={() => setShowCustomModal(true)}
              className="custom-announcement-btn"
            >
              <Megaphone size={16} />
              <span>Custom Message</span>
            </button>
          </div>

          <div className="action-buttons-grid">
            {presets.map((preset) => {
              const IconComponent = preset.icon;
              const isCurrentlyActive = activeAlert?.type === preset.type;

              return (
                <button
                  key={preset.id}
                  onClick={() => triggerAlert(preset)}
                  className={`preset-action-card ${preset.theme} ${isCurrentlyActive ? 'card-active' : ''}`}
                  style={{ '--accent-color': preset.color }}
                >
                  <div className="preset-card-header">
                    <div className="preset-icon-bubble">
                      <IconComponent size={24} />
                    </div>
                    <span className="preset-badge">{preset.badge}</span>
                  </div>

                  <div className="preset-card-text">
                    <h3 className="preset-title">{preset.title}</h3>
                    <p className="preset-subtitle">{preset.subtitle}</p>
                  </div>

                  <div className="preset-card-footer">
                    <span className="broadcast-trigger-text">
                      {isCurrentlyActive ? 'Currently Showing on Stage' : 'Broadcast to Stage →'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Stage Stickers / Memes (Slides Bottom to Top on Stage) */}
        <div className="admin-card">
          <div className="card-top-row">
            <div>
              <span className="card-tag">🎬 LIVE STAGE STICKERS (ANIMATES BOTTOM TO TOP)</span>
              <h2 className="card-title">Kollywood Meme & Reaction Buttons</h2>
              <p className="card-desc">
                Click any of these buttons to animate the character sticker image from bottom to top on the main countdown stage!
              </p>
            </div>
          </div>

          <div className="meme-buttons-grid">
            {BUTTON_IMAGES.map((item) => {
              const isCurrentlyActive = activePopupImage?.id?.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => triggerPopupImage(item)}
                  className={`meme-action-card ${isCurrentlyActive ? 'card-active' : ''}`}
                >
                  <div className="meme-card-image-wrap">
                    <img src={item.image} alt={item.title} className="meme-card-thumb" />
                    <span className="meme-card-tag">{item.tag}</span>
                  </div>

                  <div className="meme-card-info">
                    <h3 className="meme-card-title">{item.title}</h3>
                    <p className="meme-card-sub">{item.subtitle}</p>
                  </div>

                  <div className="meme-card-footer">
                    <span className="meme-trigger-text">
                      <ArrowUpCircle size={14} />
                      {isCurrentlyActive ? 'Showing on Stage' : 'Animate to Stage ↑'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Mirror Preview */}
        <div className="admin-card preview-card">
          <div className="card-top-row">
            <div>
              <span className="card-tag">STAGE MIRROR</span>
              <h2 className="card-title">Audience Screen Live Preview</h2>
            </div>
            {activeAlert && (
              <span className="preview-badge alert-active">
                <Sparkles size={14} /> Alert Overlay Visible
              </span>
            )}
          </div>

          <div className="stage-mini-viewport kollywood-mini-monitor">
            <div className="mini-clapper-slate">
              <span className="mini-slate-label">SCENE: DEVFORGE • TAKE: #{shotCount}</span>
              <div className="stage-mini-clock">{formatTime(remainingTimeMs)}</div>
              <div className="stage-mini-status">
                {isRunning ? '● SPRINT IN PROGRESS' : '● COUNTDOWN PAUSED'}
              </div>
            </div>

            {activeAlert && (
              <div className="mini-alert-preview">
                <span className="mini-alert-badge">ANNOUNCEMENT</span>
                <strong>{activeAlert.title}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Announcement Modal */}
      {showCustomModal && (
        <div className="modal-backdrop" onClick={() => setShowCustomModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Broadcast Custom Announcement</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowCustomModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Announcement Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SUBMISSION DEADLINE EXTENDED BY 30 MINS"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Instructions</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Push your commits to GitHub and complete your project submission."
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Duration (Minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="180"
                  value={customDurationMins}
                  onChange={(e) => setCustomDurationMins(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCustomModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-broadcast">
                  <Megaphone size={16} />
                  <span>Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Exact Duration Modal */}
      {showTimeAdjustModal && (
        <div className="modal-backdrop" onClick={() => setShowTimeAdjustModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Set Exact Countdown Duration</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowTimeAdjustModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyCustomTime} className="modal-form">
              <div className="time-input-row">
                <div className="form-group">
                  <label className="form-label">Hours</label>
                  <input
                    type="number"
                    className="form-input text-center"
                    min="0"
                    max="100"
                    value={inputHours}
                    onChange={(e) => setInputHours(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Minutes</label>
                  <input
                    type="number"
                    className="form-input text-center"
                    min="0"
                    max="59"
                    value={inputMinutes}
                    onChange={(e) => setInputMinutes(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Seconds</label>
                  <input
                    type="number"
                    className="form-input text-center"
                    min="0"
                    max="59"
                    value={inputSeconds}
                    onChange={(e) => setInputSeconds(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowTimeAdjustModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-broadcast">
                  <Clock size={16} />
                  <span>Set New Duration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Alert Preview when triggered */}
      {activeAlert && (
        <AlertOverlay alert={activeAlert} onDismiss={dismissAlert} isAdmin={true} />
      )}

      {/* Embedded Popup Image Preview when triggered */}
      {activePopupImage && (
        <PopupImageOverlay popup={activePopupImage} onDismiss={dismissPopupImage} isAdmin={true} />
      )}
    </div>
  );
}
