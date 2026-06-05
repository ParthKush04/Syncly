import DashboardNavbar from '../components/dashboard/DashboardNavbar.jsx';
import TagPanel from '../components/dashboard/TagPanel.jsx';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/dashboardService.js';

const partnerQueue = ['Aarav', 'Maya', 'Riya', 'Arjun'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [connected, setConnected] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [partnerIndex, setPartnerIndex] = useState(0);
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const data = await getDashboardData();

        if (mounted && data?.user) {
          const normalizedUser = {
            ...data.user,
            photoUrl: data.user.profileImage || data.user.photoUrl || ''
          };

          setUser(normalizedUser);
          localStorage.setItem('synclyUser', JSON.stringify(normalizedUser));
        }
      } catch {
        if (mounted) {
          const savedUser = localStorage.getItem('synclyUser');

          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser({
                ...parsedUser,
                photoUrl: parsedUser.profileImage || parsedUser.photoUrl || ''
              });
            } catch {
              setUser(null);
            }
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://syncly-3nm4.onrender.com'}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      localStorage.removeItem('synclyToken');
      localStorage.removeItem('synclyUser');
      navigate('/', { replace: true });
    }
  };

  const startCamera = async () => {
    if (streamRef.current) {
      return true;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setCameraReady(true);
      return true;
    } catch {
      setCameraReady(false);
      return false;
    }
  };

  const stopCamera = () => {
    const stream = streamRef.current;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const handleStart = async () => {
    setMatching(true);
    setConnected(false);
    setSpinnerVisible(true);
    const opened = await startCamera();

    if (!opened) {
      setMatching(false);
      setSpinnerVisible(false);
      return;
    }

    window.setTimeout(() => {
      setConnected(true);
      setMatching(false);
      setSpinnerVisible(false);
    }, 1200);
  };

  const handleCancel = () => {
    stopCamera();
    setMatching(false);
    setConnected(false);
    setCameraReady(false);
    setPartnerIndex(0);
  };

  const handleSkip = async () => {
    setPartnerIndex((current) => (current + 1) % partnerQueue.length);
    setConnected(false);
    setMatching(true);
    setSpinnerVisible(true);

    const opened = await startCamera();

    if (!opened) {
      setMatching(false);
      setSpinnerVisible(false);
      return;
    }

    window.setTimeout(() => {
      setConnected(true);
      setMatching(false);
      setSpinnerVisible(false);
    }, 900);
  };

  const handleAddInterest = () => {
    const rawValue = window.prompt('Add a new interest');
    const value = rawValue?.trim();

    if (!value) {
      return;
    }

    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const existingInterests = currentUser.interests || [];

      if (existingInterests.some((item) => item.toLowerCase() === value.toLowerCase())) {
        return currentUser;
      }

      const nextUser = {
        ...currentUser,
        interests: [...existingInterests, value]
      };

      localStorage.setItem('synclyUser', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const partnerName = partnerQueue[partnerIndex];

  return (
    <main className="min-h-screen px-4 py-6 text-white sm:px-6 lg:px-10 lg:py-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-matte" />
      <div className="mx-auto grid max-w-7xl gap-6">
        <DashboardNavbar user={user || {}} onSignOut={handleSignOut} />
        <section className="grid gap-6">
          <div className="rounded-[2rem] border border-white/12 card-matte p-6 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-cyan-100/85">Matchmaking</p>
                <p className="mt-2 text-sm leading-6 text-white/75 sm:text-base">
                  Open your camera first. Cancel or skip whenever you want.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {!matching && !connected ? (
                  <StartMatchButton onStart={handleStart} />
                ) : null}

                {matching || connected ? (
                  <>
                    <ActionButton onClick={handleCancel} label="Cancel" />
                    <ActionButton onClick={handleSkip} label="Skip" />
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <CameraScreen
                title="You"
                subtitle={matching ? 'Camera on. Looking for a match.' : connected ? 'Live camera is open.' : 'Click start to open your camera.'}
                active={matching || connected || cameraReady}
                showSpinner={spinnerVisible && matching}
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              </CameraScreen>

              <CameraScreen
                title={connected ? partnerName : 'Other user'}
                subtitle={connected ? 'Ready to talk now.' : matching ? 'Waiting for the next user.' : 'Blank until you start matchmaking.'}
                active={connected || matching}
                showSpinner={spinnerVisible && matching}
              >
                {connected ? (
                  <div className="flex h-full w-full flex-col items-center justify-center text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-white/6 text-2xl font-semibold text-white">
                      {partnerName.slice(0, 1).toUpperCase()}
                    </div>
                    <p className="mt-4 text-sm font-medium text-white/85">
                      {partnerName}
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-white/60">
                      Remote camera view appears here when connected.
                    </p>
                  </div>
                ) : null}
              </CameraScreen>
            </div>
          </div>

          <TagPanel
            title="Interests"
            items={user?.interests || []}
            accent="cyan"
            actionLabel="Add interest"
            onAction={handleAddInterest}
          />
        </section>
      </div>
    </main>
  );
}

function StartMatchButton({ onStart }) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
    >
      Start matchmaking
    </button>
  );
}

function ActionButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
    >
      {label}
    </button>
  );
}

function CameraScreen({ title, subtitle, active, showSpinner = false, children }) {
  return (
    <div className="flex min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1119] md:min-h-[24rem]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/55">{subtitle}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75">
          Live
        </span>
      </div>

      <div className="relative flex min-h-0 flex-1 items-stretch justify-stretch bg-[#05080d]">
        {showSpinner ? <SpinnerOverlay /> : null}
        {active ? (
          children
        ) : (
          <div className="grid w-full place-items-center px-6 text-center text-white/60">
            <div>
              <p className="text-base font-medium text-white/75">Blank screen</p>
              <p className="mt-2 text-sm leading-6 text-white/55">This stays blank until you start matchmaking.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpinnerOverlay() {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-[#05080d]/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/15 border-t-cyan-300" />
        <div>
          <p className="text-sm font-semibold text-white">Finding your match</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/55">Connecting camera stream</p>
        </div>
      </div>
    </div>
  );
}
