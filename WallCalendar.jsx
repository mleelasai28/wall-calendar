import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./WallCalendar.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const WEEKDAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

const HOLIDAYS = {
  "1-1":   "New Year's Day",
  "2-14":  "Valentine's Day",
  "3-8":   "Women's Day",
  "3-17":  "St. Patrick's",
  "4-1":   "April Fools",
  "5-1":   "Labour Day",
  "10-31": "Halloween",
  "11-11": "Veterans Day",
  "12-24": "Christmas Eve",
  "12-25": "Christmas",
  "12-31": "New Year's Eve",
};

const THEMES = [
  {
    label: "CSK",
    bg: "linear-gradient(135deg,#FFFF00 0%,#0000FF 40%,#FFD700 100%)",
    accent: "#FFD700",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/200px-Chennai_Super_Kings_Logo.svg.png",
  },
  {
    label: "DC",
    bg: "linear-gradient(135deg,#0000FF 0%,#FF0000 40%,#FFFFFF 100%)",
    accent: "#FF0000",
    logo: "/dc.jpg",
  },
  {
    label: "GT",
    bg: "linear-gradient(135deg,#000080 0%,#FFD700 40%,#FFFFFF 100%)",
    accent: "#FFD700",
    logo: "/gt.png",
  },
  {
    label: "KKR",
    bg: "linear-gradient(135deg,#800080 0%,#FFD700 40%,#FFFFFF 100%)",
    accent: "#FFD700",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/200px-Kolkata_Knight_Riders_Logo.svg.png",
  },
  {
    label: "LSG",
    bg: "linear-gradient(135deg,#87CEEB 0%,#000080 40%,#FFFFFF 100%)",
    accent: "#000080",
    logo: "/lsg.png",
  },
  {
    label: "MI",
    bg: "linear-gradient(135deg,#0000FF 0%,#FFD700 40%,#FFFFFF 100%)",
    accent: "#FFD700",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/200px-Mumbai_Indians_Logo.svg.png",
  },
  {
    label: "PBKS",
    bg: "linear-gradient(135deg,#FF0000 0%,#FFFFFF 40%,#000000 100%)",
    accent: "#FF0000",
    logo: "/pbks.png",
  },
  {
    label: "RR",
    bg: "linear-gradient(135deg,#FFC0CB 0%,#0000FF 40%,#FFFFFF 100%)",
    accent: "#FFC0CB",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Rajasthan_Royals_Logo.svg/200px-Rajasthan_Royals_Logo.svg.png",
  },
  {
    label: "RCB",
    bg: "linear-gradient(135deg,#FF0000 0%,#FFD700 40%,#000000 100%)",
    accent: "#FF0000",
    logo: "/rcb.png",
  },
  {
    label: "SRH",
    bg: "linear-gradient(135deg,#FFA500 0%,#000000 40%,#FFFFFF 100%)",
    accent: "#FFA500",
    logo: "/srh.png",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toDateNum = (date) =>
  date
    ? date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate()
    : 0;

const monthKey   = (y, m) => `${y}-${m}`;
const dayKey     = (y, m, d) => `${y}-${m}-${d}`;
const isSameDay  = (a, b) => a && b && toDateNum(a) === toDateNum(b);

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

/** Returns Monday-indexed start offset (0 = Monday … 6 = Sunday) */
const getStartOffset = (y, m) => {
  const dow = new Date(y, m, 1).getDay();
  return dow === 0 ? 6 : dow - 1;
};

const formatRange = (start, end) => {
  if (!start) return null;
  const opts = { month: "short", day: "numeric" };
  if (!end || isSameDay(start, end)) {
    return start.toLocaleDateString("en-US", opts);
  }
  const lo = toDateNum(start) < toDateNum(end) ? start : end;
  const hi = toDateNum(start) < toDateNum(end) ? end   : start;
  const days = Math.round((hi - lo) / 86_400_000) + 1;
  return `${lo.toLocaleDateString("en-US", opts)} – ${hi.toLocaleDateString("en-US", opts)} · ${days} days`;
};

// ─── Custom hook: localStorage sync ───────────────────────────────────────────

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);

  return [value, setValue];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Binding() {
  return (
    <div className={styles.binding} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className={styles.ring} />
      ))}
    </div>
  );
}

function Hero({ year, month, theme, onPrev, onNext, onTheme }) {
  return (
    <div className={styles.hero} style={{ background: theme.bg }}>
      <div className={styles.heroOverlay} />
      <img src={theme.logo} alt={`${theme.label} logo`} className={styles.heroLogo} />

      <div className={styles.navArrows}>
        <button className={styles.navBtn} onClick={onPrev} aria-label="Previous month">
          ‹
        </button>
        <button className={styles.themeBtn} onClick={onTheme}>
          {theme.label}
        </button>
        <button className={styles.navBtn} onClick={onNext} aria-label="Next month">
          ›
        </button>
      </div>

      <div className={styles.heroBadge}>
        <div className={styles.heroYear}>{year}</div>
        <div className={styles.heroMonth}>{MONTHS[month]}</div>
      </div>

      {/* Zigzag chevron */}
      <div className={styles.heroChevron} aria-hidden="true">
        <svg viewBox="0 0 720 36" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,36 L0,18 L180,0 L360,18 L540,0 L720,18 L720,36 Z" fill="white" />
        </svg>
      </div>
    </div>
  );
}

function NotesPanel({ rangeLabel, monthNote, onMonthNoteChange, dayNotes, selectedDayKey, onDayNoteChange }) {
  return (
    <div className={styles.notesPanel}>
      <div className={styles.notesLabel}>Notes</div>

      {rangeLabel && (
        <div className={styles.rangeSummary}>{rangeLabel}</div>
      )}

      <div className={styles.notesSection}>
        <div className={styles.notesSectionLabel}>Month</div>
        <div className={styles.notesWrapper}>
          <textarea
            className={styles.notesArea}
            value={monthNote}
            onChange={(e) => onMonthNoteChange(e.target.value)}
            placeholder="month notes…"
            spellCheck={false}
            aria-label="Monthly notes"
          />
          <div className={styles.notesBg} aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={styles.noteLine} />
            ))}
          </div>
        </div>
      </div>

      {selectedDayKey && (
        <div className={styles.notesSection}>
          <div className={styles.notesSectionLabel}>Day</div>
          <div className={styles.notesWrapper}>
            <textarea
              className={styles.notesArea}
              style={{ minHeight: 64 }}
              value={dayNotes[selectedDayKey] || ""}
              onChange={(e) => onDayNoteChange(selectedDayKey, e.target.value)}
              placeholder="day note…"
              spellCheck={false}
              aria-label="Day note"
            />
            <div className={styles.notesBg} aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className={styles.noteLine} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DayCell({ day, type, isToday, isSat, isSun, isRangeStart, isRangeEnd, isInRange,
  hasNote, holiday, onMouseDown, onMouseEnter, accentColor }) {
  const classes = [
    styles.day,
    type !== "cur"          ? styles.other       : "",
    isToday                 ? styles.today       : "",
    isSat && type === "cur" ? styles.sat         : "",
    isSun && type === "cur" ? styles.sun         : "",
    isInRange               ? styles.inRange     : "",
    isRangeStart            ? styles.rangeStart  : "",
    isRangeEnd              ? styles.rangeEnd    : "",
    hasNote                 ? styles.hasNote     : "",
  ].filter(Boolean).join(" ");

  const style = {};
  if (isRangeStart || isRangeEnd) style["--accent"] = accentColor;

  return (
    <div
      className={classes}
      style={style}
      onMouseDown={type === "cur" ? onMouseDown : undefined}
      onMouseEnter={type === "cur" ? onMouseEnter : undefined}
      role={type === "cur" ? "button" : undefined}
      tabIndex={type === "cur" ? 0 : undefined}
      aria-label={type === "cur" ? `${day}${isToday ? ", today" : ""}${holiday ? `, ${holiday}` : ""}` : undefined}
    >
      <span>{day}</span>
      {holiday && type === "cur" && (
        <span className={styles.holidayLabel}>{holiday}</span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WallCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate]   = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [themeIdx, setThemeIdx]   = useLocalStorage("cal_theme", 0);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd]     = useState(null);
  const [selecting, setSelecting]   = useState(false);
  const [monthNotes, setMonthNotes] = useLocalStorage("cal_month_notes", {});
  const [dayNotes,   setDayNotes]   = useLocalStorage("cal_day_notes",   {});
  const [animKey, setAnimKey]       = useState(0);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const theme = THEMES[themeIdx % THEMES.length];

  // Build calendar cells
  const cells = (() => {
    const offset = getStartOffset(year, month);
    const dim    = getDaysInMonth(year, month);
    const prevDim = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);
    const result = [];
    for (let i = 0; i < offset; i++)
      result.push({ day: prevDim - offset + 1 + i, type: "prev" });
    for (let d = 1; d <= dim; d++)
      result.push({ day: d, type: "cur" });
    let n = 1;
    while (result.length % 7 !== 0) result.push({ day: n++, type: "next" });
    return result;
  })();

  // Range helpers
  const startNum = toDateNum(rangeStart);
  const endNum   = toDateNum(rangeEnd);
  const loNum    = Math.min(startNum || Infinity, endNum || Infinity) === Infinity ? startNum : Math.min(startNum, endNum);
  const hiNum    = Math.max(startNum, endNum);

  const isInRange     = (d) => loNum && hiNum && d >= loNum && d <= hiNum;
  const isRangeStart  = (d) => startNum && d === startNum;
  const isRangeEnd    = (d) => endNum   && d === endNum;

  // Navigation
  const navigate = (dir) => {
    setViewDate(new Date(year, month + dir, 1));
    setAnimKey(k => k + 1);
  };

  // Selection
  const handleMouseDown = useCallback((y, m, d) => {
    const date = new Date(y, m, d);
    setRangeStart(date);
    setRangeEnd(null);
    setSelecting(true);
  }, []);

  const handleMouseEnter = useCallback((y, m, d) => {
    if (!selecting) return;
    setRangeEnd(new Date(y, m, d));
  }, [selecting]);

  useEffect(() => {
    const up = () => setSelecting(false);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("touchend", up); };
  }, []);

  // Notes
  const mKey = monthKey(year, month + 1);
  const monthNote = monthNotes[mKey] || "";
  const onMonthNoteChange = (val) => setMonthNotes(n => ({ ...n, [mKey]: val }));

  // Selected day key for day notes
  const selectedDayKey = rangeStart && !rangeEnd
    ? dayKey(year, month + 1, rangeStart.getDate())
    : null;

  const onDayNoteChange = (k, val) =>
    setDayNotes(n => ({ ...n, [k]: val }));

  const clearSelection = () => { setRangeStart(null); setRangeEnd(null); };

  const rangeLabel = formatRange(rangeStart, rangeEnd);

  return (
    <div className={styles.calendarWrap}>
      <div className={styles.calendar}>
        <Binding />

        <Hero
          year={year}
          month={month}
          theme={theme}
          onPrev={() => navigate(-1)}
          onNext={() => navigate(1)}
          onTheme={() => setThemeIdx(i => (i + 1) % THEMES.length)}
        />

        <div className={styles.body}>
          <NotesPanel
            rangeLabel={rangeLabel}
            monthNote={monthNote}
            onMonthNoteChange={onMonthNoteChange}
            dayNotes={dayNotes}
            selectedDayKey={selectedDayKey}
            onDayNoteChange={onDayNoteChange}
          />

          <div className={styles.gridPanel}>
            <div className={styles.weekdays}>
              {WEEKDAYS.map((wd, i) => (
                <div
                  key={wd}
                  className={[styles.wd, i === 5 ? styles.wdSat : "", i === 6 ? styles.wdSun : ""].filter(Boolean).join(" ")}
                >
                  {wd}
                </div>
              ))}
            </div>

            <div key={animKey} className={`${styles.days} ${styles.flipEnter}`}>
              {cells.map(({ day, type }, idx) => {
                if (type !== "cur") {
                  return <div key={`${type}-${day}-${idx}`} className={`${styles.day} ${styles.other}`}><span>{day}</span></div>;
                }
                const date    = new Date(year, month, day);
                const dateNum = toDateNum(date);
                const dow     = date.getDay();
                const hKey    = `${month + 1}-${day}`;
                const dKey    = dayKey(year, month + 1, day);

                return (
                  <DayCell
                    key={`cur-${day}`}
                    day={day}
                    type="cur"
                    isToday={isSameDay(date, today)}
                    isSat={dow === 6}
                    isSun={dow === 0}
                    isRangeStart={isRangeStart(dateNum)}
                    isRangeEnd={isRangeEnd(dateNum)}
                    isInRange={isInRange(dateNum)}
                    hasNote={!!dayNotes[dKey]}
                    holiday={HOLIDAYS[hKey]}
                    accentColor={theme.accent}
                    onMouseDown={() => handleMouseDown(year, month, day)}
                    onMouseEnter={() => handleMouseEnter(year, month, day)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.legend}>
            <span className={styles.legendDot} style={{ background: theme.accent }} />
            <span>selected range</span>
          </div>
          <div className={styles.legend}>
            <span className={styles.legendToday} />
            <span>today</span>
          </div>
          <div className={styles.legend}>
            <span className={styles.legendNote} style={{ background: theme.accent }} />
            <span>has note</span>
          </div>
          <button className={styles.clearBtn} onClick={clearSelection}>
            clear selection
          </button>
        </div>
      </div>
    </div>
  );
}
