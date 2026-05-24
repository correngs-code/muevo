/* Lucide-style SVG icons used in the Ognicent UI kit.
   All icons share: width/height 1em (scales with font-size),
   stroke="currentColor", fill="none", strokeLinecap="round",
   strokeLinejoin="round". Default strokeWidth 2; pass `weight` to override. */

const ogIcon = (paths, weight = 2) => (props) => {
  const { size = 18, ...rest } = props || {};
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={weight}
      strokeLinecap="round" strokeLinejoin="round"
      {...rest}
    >
      {paths}
    </svg>
  );
};

const Wallet      = ogIcon(<><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M20 12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6"/><path d="M16 14h.01"/></>, 2.2);
const Home        = ogIcon(<path d="M3 10.5 12 3l9 7.5V20a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9.5Z"/>);
const CalendarRange = ogIcon(<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>);
const Plus        = ogIcon(<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>, 2.5);
const ArrowUp     = ogIcon(<><path d="M12 19V5M5 12l7-7 7 7"/></>, 2.5);
const ArrowRight  = ogIcon(<path d="M5 12h14M13 5l7 7-7 7"/>);
const Mic         = ogIcon(<><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/></>);
const Trash2      = ogIcon(<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>);
const Pencil      = ogIcon(<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>);
const X           = ogIcon(<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>);
const Sparkles    = ogIcon(<path d="m12 3-2.4 6L3 9l4.8 4.4L6 21l6-3 6 3-1.8-7.6L21 9l-6.6 0L12 3Z"/>);
const ShieldCheck = ogIcon(<><path d="M12 22s8-7.58 8-13a8 8 0 0 0-16 0c0 5.42 8 13 8 13Z"/><path d="m9 12 2 2 4-5"/></>);
const TrendingUp  = ogIcon(<><path d="m23 6-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></>);
const TrendingDown = ogIcon(<><path d="m23 18-9.5-9.5-5 5L1 6"/><path d="M17 18h6v-6"/></>);
const Bell        = ogIcon(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>);
const Eye         = ogIcon(<><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z"/><circle cx="12" cy="12" r="3"/></>);
const Zap         = ogIcon(<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>);
const ChevronLeft  = ogIcon(<path d="m15 18-6-6 6-6"/>);
const ChevronRight = ogIcon(<path d="m9 18 6-6-6-6"/>);
const LogOut      = ogIcon(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>);

Object.assign(window, {
  OgWallet: Wallet, OgHome: Home, OgCalendarRange: CalendarRange, OgPlus: Plus,
  OgArrowUp: ArrowUp, OgArrowRight: ArrowRight, OgMic: Mic,
  OgTrash2: Trash2, OgPencil: Pencil, OgX: X,
  OgSparkles: Sparkles, OgShieldCheck: ShieldCheck,
  OgTrendingUp: TrendingUp, OgTrendingDown: TrendingDown,
  OgBell: Bell, OgEye: Eye, OgZap: Zap,
  OgChevronLeft: ChevronLeft, OgChevronRight: ChevronRight, OgLogOut: LogOut,
});
