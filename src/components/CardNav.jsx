import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Briefcase, User, LogOut, BarChart3, ArrowUpRight } from 'lucide-react';
import './styles/CardNav.css';

const CardNav = ({
  user,
  handleLogout,
  handleNavigation,
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor = '#4F46E5',
  buttonTextColor = '#fff'
}) => {
  // Default navigation items for Internify
  const defaultItems = [
    {
      label: 'Dashboard',
      bgColor: '#3B82F6',
      textColor: '#fff',
      links: [
        {
          label: 'View Applications',
          onClick: () => handleNavigation?.('dashboard'),
          ariaLabel: 'Go to Dashboard'
        },
        {
          label: 'Analytics',
          onClick: () => handleNavigation?.('dashboard'),
          ariaLabel: 'View Analytics'
        }
      ]
    },
    {
      label: 'Tools',
      bgColor: '#10B981',
      textColor: '#fff', 
      links: [
        {
          label: 'ATS Analyzer',
          onClick: () => window.location.href = '/ats-analyser',
          ariaLabel: 'ATS Resume Analyzer'
        },
        {
          label: 'CGPA Calculator',
          onClick: () => window.location.href = '/cgpa-calculator',
          ariaLabel: 'Calculate CGPA'
        }
      ]
    },
    {
      label: 'Profile',
      bgColor: '#8B5CF6',
      textColor: '#fff', 
      links: [
        {
          label: 'Edit Profile',
          onClick: () => handleNavigation?.('profile'),
          ariaLabel: 'Edit Profile'
        },
        {
          label: 'Help & Support',
          onClick: () => window.location.href = '/help',
          ariaLabel: 'Get Help'
        }
      ]
    },
    {
      label: 'Account',
      bgColor: '#EF4444',
      textColor: '#fff',
      links: [
        {
          label: 'Settings',
          onClick: () => handleNavigation?.('profile'),
          ariaLabel: 'Account Settings'
        },
        {
          label: 'Logout',
          onClick: handleLogout,
          ariaLabel: 'Logout'
        }
      ]
    }
  ];

  const navItems = items || defaultItems;
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 300;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 300;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container" onClick={() => handleNavigation?.('dashboard')} style={{ cursor: 'pointer' }}>
            {logo ? (
              <img src={logo} alt={logoAlt} className="logo" />
            ) : (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Internify
                </h1>
              </div>
            )}
          </div>

          <button
            type="button"
            className="card-nav-cta-button flex items-center space-x-2"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            onClick={() => handleNavigation?.('profile')}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{user?.name || user?.email || 'Profile'}</span>
          </button>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(navItems || []).slice(0, 4).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <button
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    onClick={lnk.onClick || (() => {})}
                    aria-label={lnk.ariaLabel}
                    style={{ background: 'transparent', border: 'none', padding: 0, color: 'inherit' }}
                  >
                    <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                    {lnk.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
