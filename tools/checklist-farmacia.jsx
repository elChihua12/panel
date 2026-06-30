const { useState, useEffect, useCallback, useRef } = React;

// ─── Constants (same logic, different skin) ───────────────────────
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_SEMANA = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

const CAT_COLORS = {
  Insumo:    { bg: "#FEF9EF", text: "#8B6914", border: "#E5C96E", dot: "#D4A820" },
  Reposición:{ bg: "#F0F7F4", text: "#1B5E3B", border: "#7BC4A0", dot: "#2D8B5E" },
  Gestión:   { bg: "#F4F1EC", text: "#5C4A32", border: "#C4B59A", dot: "#8B7355" },
  "Compra Municipal": { bg: "#EDF2F7", text: "#2C5282", border: "#90B4D6", dot: "#4A7FB5" },
  Otro:      { bg: "#F5F5F5", text: "#555", border: "#CCC", dot: "#999" },
};

const MCAT_COLORS = {
  Regulatorio: { bg: "#FDF2F2", text: "#9B2C2C", border: "#E8A0A0", dot: "#C53030" },
  Inventario:  { bg: "#FEF9EF", text: "#8B6914", border: "#E5C96E", dot: "#D4A820" },
  Gestión:     { bg: "#F0F7F4", text: "#1B5E3B", border: "#7BC4A0", dot: "#2D8B5E" },
  RRHH:        { bg: "#F3F0F7", text: "#553C8B", border: "#B4A0D6", dot: "#7C5EBB" },
  Calidad:     { bg: "#EDF2F7", text: "#2C5282", border: "#90B4D6", dot: "#4A7FB5" },
};

const DEFAULT_DAILY = [
  { id: "d1", titulo: "Comprar pizarras (x3)", cat: "Insumo", urgente: true, notas: "Municipio no responde — comprar directo, guardar boleta.", recurrente: false },
  { id: "d2", titulo: "Solicitar reposición Metformina 850mg", cat: "Reposición", urgente: true, notas: "Stock crítico < 5 días. Solicitud formal al municipio.", recurrente: false },
  { id: "d3", titulo: "Revisión quincenal de inventario", cat: "Gestión", urgente: false, notas: "Foco: crónicos + 3 con mayor rotación mes pasado.", recurrente: "quincenal" },
  { id: "d4", titulo: "Levantar listado rupturas frecuentes", cat: "Gestión", urgente: false, notas: "Cruzar historial últimos 3 meses.", recurrente: false },
  { id: "d5", titulo: "Crear registro trazable solicitudes municipio", cat: "Compra Municipal", urgente: false, notas: "Campos: qué, cuándo, a quién, estado.", recurrente: false },
  { id: "d6", titulo: "Configurar WhatsApp Business", cat: "Gestión", urgente: false, notas: "Bloqueado hasta inventario estable.", recurrente: false },
  { id: "d7", titulo: "Diseñar flujo chatbot disponibilidad", cat: "Gestión", urgente: false, notas: "Depende de WhatsApp + inventario.", recurrente: false },
];

const DEFAULT_MONTHLY = [
  { id: "m1", cat: "Regulatorio", titulo: "Informe psicotrópicos y estupefacientes ISP", desc: "Reporte mensual obligatorio de movimientos de sustancias controladas", dia: 5 },
  { id: "m2", cat: "Regulatorio", titulo: "Revisión y archivo recetas retenidas", desc: "Control y almacenamiento de recetas de fármacos retenidos del mes", dia: 10 },
  { id: "m3", cat: "Regulatorio", titulo: "Registro de temperatura y humedad", desc: "Verificar y archivar registros continuos del mes", dia: 5 },
  { id: "m4", cat: "Inventario", titulo: "Control de vencimientos", desc: "Revisión de fechas de vencimiento y retiro de productos próximos a vencer", dia: 15 },
  { id: "m5", cat: "Inventario", titulo: "Ajuste de inventario", desc: "Conciliación stock físico vs sistema informático", dia: 20 },
  { id: "m6", cat: "Inventario", titulo: "Devolución a proveedor / Destrucción de mermas", desc: "Gestionar vencidos, dañados o retirados del mercado", dia: 25 },
  { id: "m7", cat: "Gestión", titulo: "Revisión indicadores de dispensación", desc: "Análisis de ventas, errores de dispensación e indicadores de calidad", dia: 10 },
  { id: "m8", cat: "Gestión", titulo: "Auditoría de caja y facturación", desc: "Cuadre de caja, revisión de boletas y facturas del mes", dia: 5 },
  { id: "m9", cat: "Gestión", titulo: "Evaluación de proveedores y pedidos", desc: "Revisar cumplimiento, quiebres de stock y planificar pedidos", dia: 20 },
  { id: "m10", cat: "RRHH", titulo: "Capacitación del personal", desc: "Sesión de actualización farmacológica o normativa", dia: 28 },
  { id: "m11", cat: "RRHH", titulo: "Revisión de turnos y asistencia", desc: "Validar registro de horas, permisos y planilla", dia: 28 },
  { id: "m12", cat: "Calidad", titulo: "Revisión de reclamos y sugerencias", desc: "Análisis libro de reclamos, atención de quejas", dia: 15 },
  { id: "m13", cat: "Calidad", titulo: "Verificación BPD", desc: "Auditoría interna condiciones de almacenamiento y dispensación", dia: 25 },
  { id: "m14", cat: "Calidad", titulo: "Revisión alertas sanitarias y circulares ISP", desc: "Verificar y comunicar alertas y retiros vigentes", dia: 10 },
];

const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const monthKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; };
const getTurno = () => new Date().getHours() < 14 ? "am" : "pm";
const fmtTime = (iso) => { if (!iso) return "—"; const d = new Date(iso); return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`; };
const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso); return `${d.getDate()} ${MESES[d.getMonth()].slice(0,3)}`; };

async function sGet(key, fb) { try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : fb; } catch { return fb; } }
async function sSet(key, val) { try { await window.storage.set(key, JSON.stringify(val)); } catch(e) { console.error(e); } }

// ─── Pharmacy Cross SVG ──────────────────────────────────────────
const PharmaCross = ({ size = 20, color = "#1B5E3B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="8" y="2" width="8" height="20" rx="1.5" fill={color} />
    <rect x="2" y="8" width="20" height="8" rx="1.5" fill={color} />
  </svg>
);

function FarmaciaProf() {
  const now = new Date();
  const [tab, setTab] = useState("dia");
  const [loading, setLoading] = useState(true);
  const [dailyTasks, setDailyTasks] = useState(DEFAULT_DAILY);
  const [dailyDone, setDailyDone] = useState({});
  const [checkins, setCheckins] = useState({ am: null, pm: null });
  const [monthlyDone, setMonthlyDone] = useState({});
  const [monthlyTasks, setMonthlyTasks] = useState(DEFAULT_MONTHLY);
  const [history, setHistory] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [filtro, setFiltro] = useState("Todas");
  const [mFiltro, setMFiltro] = useState("Todas");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ titulo: "", cat: "Gestión", notas: "", urgente: false, tipo: "dia", dia: 15, desc: "" });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => { setToast(msg); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2200); };

  useEffect(() => {
    (async () => {
      const tk = todayKey(), mk = monthKey();
      const st = await sGet("farma-daily-tasks", null); if (st) setDailyTasks(st);
      setDailyDone(await sGet(`farma-day-${tk}`, {}));
      setCheckins(await sGet(`farma-checkin-${tk}`, { am: null, pm: null }));
      const sm = await sGet("farma-monthly-tasks", null); if (sm) setMonthlyTasks(sm);
      setMonthlyDone(await sGet(`farma-month-${mk}`, {}));
      setHistory(await sGet("farma-history", []));
      setLoading(false);
    })();
  }, []);

  // Load Sora from Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const doCheckin = useCallback(async () => {
    const t = getTurno(); if (checkins[t]) return;
    const u = { ...checkins, [t]: new Date().toISOString() }; setCheckins(u);
    await sSet(`farma-checkin-${todayKey()}`, u);
    const h = [{ tipo: "checkin", turno: t, fecha: new Date().toISOString() }, ...history].slice(0, 200);
    setHistory(h); await sSet("farma-history", h);
    showToast(t === "am" ? "Check-in mañana registrado" : "Check-in tarde registrado");
  }, [checkins, history]);

  const toggleDaily = useCallback(async (id) => {
    const was = !!dailyDone[id]; const u = { ...dailyDone };
    if (was) delete u[id]; else u[id] = new Date().toISOString();
    setDailyDone(u); await sSet(`farma-day-${todayKey()}`, u);
    if (!was) { const task = dailyTasks.find(t => t.id === id); const h = [{ tipo: "daily", titulo: task?.titulo || id, fecha: new Date().toISOString() }, ...history].slice(0, 200); setHistory(h); await sSet("farma-history", h); showToast("Completada"); }
  }, [dailyDone, dailyTasks, history]);

  const toggleMonthly = useCallback(async (id) => {
    const was = !!monthlyDone[id]; const u = { ...monthlyDone };
    if (was) delete u[id]; else u[id] = new Date().toISOString();
    setMonthlyDone(u); await sSet(`farma-month-${monthKey()}`, u);
    if (!was) { const task = monthlyTasks.find(t => t.id === id); const h = [{ tipo: "monthly", titulo: task?.titulo || id, fecha: new Date().toISOString() }, ...history].slice(0, 200); setHistory(h); await sSet("farma-history", h); showToast("Tarea mensual completada"); }
  }, [monthlyDone, monthlyTasks, history]);

  const addTask = useCallback(async () => {
    if (!addForm.titulo.trim()) return;
    if (addForm.tipo === "dia") { const n = { id: `d${Date.now()}`, titulo: addForm.titulo.trim(), cat: addForm.cat, urgente: addForm.urgente, notas: addForm.notas, recurrente: false }; const u = [...dailyTasks, n]; setDailyTasks(u); await sSet("farma-daily-tasks", u); }
    else { const n = { id: `m${Date.now()}`, cat: addForm.cat, titulo: addForm.titulo.trim(), desc: addForm.desc || addForm.notas, dia: addForm.dia }; const u = [...monthlyTasks, n]; setMonthlyTasks(u); await sSet("farma-monthly-tasks", u); }
    setAddForm({ titulo: "", cat: "Gestión", notas: "", urgente: false, tipo: addForm.tipo, dia: 15, desc: "" }); setShowAdd(false); showToast("Tarea agregada");
  }, [addForm, dailyTasks, monthlyTasks]);

  const deleteTask = useCallback(async (id, type) => {
    if (type === "dia") { const u = dailyTasks.filter(t => t.id !== id); setDailyTasks(u); await sSet("farma-daily-tasks", u); }
    else { const u = monthlyTasks.filter(t => t.id !== id); setMonthlyTasks(u); await sSet("farma-monthly-tasks", u); }
    showToast("Eliminada");
  }, [dailyTasks, monthlyTasks]);

  const turno = getTurno();
  const checkinPending = !checkins[turno];
  const dDone = Object.keys(dailyDone).length, dTotal = dailyTasks.length;
  const mDone = Object.keys(monthlyDone).length, mTotal = monthlyTasks.length;
  const dailyFiltered = filtro === "Todas" ? dailyTasks : dailyTasks.filter(t => t.cat === filtro);
  const monthlyFiltered = mFiltro === "Todas" ? monthlyTasks : monthlyTasks.filter(t => t.cat === mFiltro);
  const dailyCats = ["Todas", ...new Set(dailyTasks.map(t => t.cat))];
  const monthlyCats = ["Todas", ...new Set(monthlyTasks.map(t => t.cat))];

  // ─── Styles ────────────────────────────────────────────────────
  const S = {
    root: { fontFamily: "'Sora', sans-serif", maxWidth: 700, margin: "0 auto", background: "#FAFAF5", minHeight: "100vh" },
    sansFont: { fontFamily: "'Sora', sans-serif" },
    header: { background: "#1B5E3B", padding: "22px 24px 18px", color: "#fff", borderBottom: "4px solid #D4A820" },
    headerTitle: { fontSize: 11, fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: "'Sora', sans-serif" },
    headerDate: { fontSize: 22, fontWeight: 400, marginTop: 4, letterSpacing: "-0.01em" },
    statBox: { flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.12)" },
    statLabel: { fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Sora', sans-serif" },
    statVal: { fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'Sora', sans-serif" },
    tabBar: { display: "flex", background: "#fff", borderBottom: "2px solid #1B5E3B", padding: "0 20px" },
    tab: (active) => ({ padding: "12px 18px", fontSize: 12, fontWeight: active ? 700 : 400, color: active ? "#1B5E3B" : "#999", background: active ? "#F0F7F4" : "none", border: "none", borderBottom: active ? "3px solid #1B5E3B" : "3px solid transparent", cursor: "pointer", fontFamily: "'Sora', sans-serif", letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: -2 }),
    card: (done, urgent) => ({ background: done ? "#F7FAF5" : "#fff", border: `1px solid ${urgent ? "#C53030" : done ? "#7BC4A0" : "#DDD5C5"}`, borderRadius: 3, overflow: "hidden", borderLeft: urgent ? "4px solid #C53030" : done ? "4px solid #2D8B5E" : "4px solid #DDD5C5" }),
    pill: (bg, text) => ({ fontSize: 10, padding: "2px 9px", borderRadius: 2, background: bg, color: text, fontWeight: 600, fontFamily: "'Sora', sans-serif", letterSpacing: "0.02em" }),
    filterBtn: (active) => ({ padding: "5px 14px", borderRadius: 2, fontSize: 11, fontWeight: 600, cursor: "pointer", border: `1px solid ${active ? "#1B5E3B" : "#DDD5C5"}`, background: active ? "#1B5E3B" : "#fff", color: active ? "#fff" : "#8B7355", fontFamily: "'Sora', sans-serif" }),
  };

  if (loading) return (
    <div style={{ ...S.root, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#1B5E3B" }}>
        <PharmaCross size={40} color="#1B5E3B" />
        <div style={{ fontSize: 13, marginTop: 12, ...S.sansFont, color: "#999" }}>Cargando...</div>
      </div>
    </div>
  );

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <PharmaCross size={18} color="rgba(255,255,255,0.7)" />
              <span style={S.headerTitle}>Farmacia Popular · Pedro Aguirre Cerda</span>
            </div>
            <div style={S.headerDate}>{DIAS_SEMANA[now.getDay()]} {now.getDate()} de {MESES[now.getMonth()]}, {now.getFullYear()}</div>
          </div>
          <div style={{ textAlign: "right", ...S.sansFont }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Turno {turno === "am" ? "Mañana" : "Tarde"}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, color: checkins[turno] ? "#8FD5A6" : "#E5C96E" }}>
              {checkins[turno] ? `✓ ${fmtTime(checkins[turno])}` : "Pendiente"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {[{ l: "Día", v: `${dDone}/${dTotal}`, ok: dDone === dTotal && dTotal > 0 }, { l: "Mes", v: `${mDone}/${mTotal}`, ok: mDone === mTotal && mTotal > 0 }, { l: "Check-in", v: `${checkins.am ? "AM" : "··"} ${checkins.pm ? "PM" : "··"}`, ok: checkins.am && checkins.pm }].map(s => (
            <div key={s.l} style={S.statBox}>
              <div style={S.statLabel}>{s.l}</div>
              <div style={{ ...S.statVal, color: s.ok ? "#8FD5A6" : "#fff" }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Check-in Banner */}
      {checkinPending && (
        <div style={{ background: "#FEF9EF", borderBottom: "2px solid #D4A820", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={S.sansFont}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#8B6914" }}>
              {turno === "am" ? "Revisión de mañana pendiente" : "Revisión de cierre pendiente"}
            </div>
            <div style={{ fontSize: 12, color: "#A6882E", marginTop: 2 }}>
              {turno === "am" ? "Revisa pendientes y prioriza lo urgente" : "¿Qué se hizo hoy? ¿Qué pasa a mañana?"}
            </div>
          </div>
          <button onClick={doCheckin} style={{ background: "#1B5E3B", color: "#fff", border: "none", borderRadius: 3, padding: "10px 22px", fontWeight: 700, fontSize: 12, cursor: "pointer", ...S.sansFont, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Registrar check-in
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={S.tabBar}>
        {[{ key: "dia", label: "Mi Día", c: dTotal - dDone }, { key: "mes", label: "Mi Mes", c: mTotal - mDone }, { key: "log", label: "Registro", c: null }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={S.tab(tab === t.key)}>
            {t.label}
            {t.c !== null && t.c > 0 && <span style={{ marginLeft: 6, background: tab === t.key ? "#1B5E3B" : "#E5E5E0", color: tab === t.key ? "#fff" : "#999", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 2 }}>{t.c}</span>}
          </button>
        ))}
        <button onClick={() => { setAddForm({ ...addForm, tipo: tab === "mes" ? "mes" : "dia" }); setShowAdd(true); }}
          style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#1B5E3B", padding: "12px 8px", ...S.sansFont, letterSpacing: "0.04em", textTransform: "uppercase" }}>+ Nueva</button>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 100px" }}>
        {tab === "dia" && (
          <>
            <div style={{ background: turno === "am" ? "#FEF9EF" : "#F0F7F4", border: `1px solid ${turno === "am" ? "#E5C96E" : "#7BC4A0"}`, borderRadius: 3, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: turno === "am" ? "#8B6914" : "#1B5E3B", ...S.sansFont, lineHeight: 1.6 }}>
              {turno === "am" ? "Inicio de jornada — revisa lo urgente, prioriza y planifica." : "Cierre — marca lo completado, identifica qué pasa a mañana."}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {dailyCats.map(c => <button key={c} onClick={() => setFiltro(c)} style={S.filterBtn(filtro === c)}>{c}</button>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dailyFiltered.map(t => {
                const done = !!dailyDone[t.id]; const col = CAT_COLORS[t.cat] || CAT_COLORS["Otro"];
                return (
                  <div key={t.id} style={S.card(done, t.urgente && !done)}>
                    <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12, cursor: "pointer" }} onClick={() => setExpandido(expandido === t.id ? null : t.id)}>
                      <input type="checkbox" checked={done} onChange={() => toggleDaily(t.id)} onClick={e => e.stopPropagation()} style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#1B5E3B", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: done ? 400 : 600, color: done ? "#AAA" : "#2D2D2D", textDecoration: done ? "line-through" : "none" }}>{t.titulo}</span>
                          <span style={S.pill(col.bg, col.text)}>{t.cat}</span>
                          {t.urgente && !done && <span style={S.pill("#FDF2F2", "#C53030")}>URGENTE</span>}
                        </div>
                      </div>
                      {done && <span style={{ fontSize: 10, color: "#AAA", ...S.sansFont }}>{fmtTime(dailyDone[t.id])}</span>}
                      <span style={{ fontSize: 10, color: "#CCC" }}>{expandido === t.id ? "▲" : "▼"}</span>
                    </div>
                    {expandido === t.id && (
                      <div style={{ padding: "0 16px 14px 44px", borderTop: "1px solid #F0EDE6" }}>
                        {t.notas && <p style={{ fontSize: 12, color: "#777", margin: "10px 0 0", lineHeight: 1.7, ...S.sansFont }}>{t.notas}</p>}
                        <button onClick={() => deleteTask(t.id, "dia")} style={{ marginTop: 10, fontSize: 11, color: "#C53030", background: "none", border: "none", cursor: "pointer", fontWeight: 600, ...S.sansFont }}>Eliminar</button>
                      </div>
                    )}
                  </div>
                );
              })}
              {dailyFiltered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#AAA", fontSize: 13, ...S.sansFont }}>Sin tareas en esta vista</div>}
            </div>
          </>
        )}

        {tab === "mes" && (
          <>
            <div style={{ background: "#fff", border: "1px solid #DDD5C5", borderRadius: 3, padding: "16px 18px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 400, color: "#2D2D2D" }}>{MESES[now.getMonth()]} {now.getFullYear()}</span>
                <span style={{ fontSize: 13, color: "#888", ...S.sansFont }}>{mDone}/{mTotal} · <strong style={{ color: mDone === mTotal && mTotal > 0 ? "#2D8B5E" : "#2D2D2D" }}>{mTotal > 0 ? Math.round(mDone/mTotal*100) : 0}%</strong></span>
              </div>
              <div style={{ background: "#F0EDE6", borderRadius: 2, height: 6 }}>
                <div style={{ width: `${mTotal > 0 ? (mDone/mTotal*100) : 0}%`, background: mDone === mTotal && mTotal > 0 ? "#2D8B5E" : "#1B5E3B", height: "100%", borderRadius: 2, transition: "width 0.4s" }} />
              </div>
            </div>

            {(() => {
              const urg = monthlyTasks.filter(t => !monthlyDone[t.id] && t.dia - now.getDate() >= 0 && t.dia - now.getDate() <= 3);
              const ven = monthlyTasks.filter(t => !monthlyDone[t.id] && t.dia < now.getDate());
              const all = [...ven, ...urg]; if (!all.length) return null;
              return (
                <div style={{ background: "#FDF2F2", border: "1px solid #E8A0A0", borderRadius: 3, padding: "14px 16px", marginBottom: 16, borderLeft: "4px solid #C53030" }}>
                  <div style={{ fontWeight: 700, color: "#9B2C2C", fontSize: 13, marginBottom: 6, ...S.sansFont }}>Atención requerida</div>
                  {all.map(a => <div key={a.id} style={{ fontSize: 12, color: "#7F1D1D", marginTop: 3, ...S.sansFont }}>• {a.titulo} — <strong>día {a.dia}</strong> {a.dia < now.getDate() ? "(vencida)" : ""}</div>)}
                </div>
              );
            })()}

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {monthlyCats.map(c => <button key={c} onClick={() => setMFiltro(c)} style={S.filterBtn(mFiltro === c)}>{c}</button>)}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {monthlyFiltered.sort((a,b) => a.dia - b.dia).map(t => {
                const done = !!monthlyDone[t.id]; const col = MCAT_COLORS[t.cat] || MCAT_COLORS["Gestión"];
                const dr = t.dia - now.getDate(); const urg = !done && dr >= 0 && dr <= 3; const ven = !done && dr < 0;
                return (
                  <div key={t.id} style={S.card(done, urg || ven)}>
                    <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12, cursor: "pointer" }} onClick={() => setExpandido(expandido === t.id ? null : t.id)}>
                      <input type="checkbox" checked={done} onChange={() => toggleMonthly(t.id)} onClick={e => e.stopPropagation()} style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#1B5E3B", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: done ? 400 : 600, color: done ? "#AAA" : "#2D2D2D", textDecoration: done ? "line-through" : "none" }}>{t.titulo}</span>
                          <span style={S.pill(col.bg, col.text)}>{t.cat}</span>
                          {urg && <span style={S.pill("#FDF2F2", "#C53030")}>{dr === 0 ? "HOY" : `${dr}d`}</span>}
                          {ven && <span style={S.pill("#FDF2F2", "#C53030")}>VENCIDA</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: "#AAA", ...S.sansFont }}>día {t.dia}</div>
                      <span style={{ fontSize: 10, color: "#CCC" }}>{expandido === t.id ? "▲" : "▼"}</span>
                    </div>
                    {expandido === t.id && (
                      <div style={{ padding: "0 16px 14px 44px", borderTop: "1px solid #F0EDE6" }}>
                        {t.desc && <p style={{ fontSize: 12, color: "#777", margin: "10px 0 0", lineHeight: 1.7, ...S.sansFont }}>{t.desc}</p>}
                        {done && <div style={{ fontSize: 11, color: "#2D8B5E", marginTop: 6, ...S.sansFont }}>✓ Completada {fmtDate(monthlyDone[t.id])} {fmtTime(monthlyDone[t.id])}</div>}
                        <button onClick={() => deleteTask(t.id, "mes")} style={{ marginTop: 10, fontSize: 11, color: "#C53030", background: "none", border: "none", cursor: "pointer", fontWeight: 600, ...S.sansFont }}>Eliminar</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, ...S.sansFont }}>Progreso por área</div>
              {Object.entries(MCAT_COLORS).map(([cat, col]) => { const t = monthlyTasks.filter(x => x.cat === cat).length; if (!t) return null; const h = monthlyTasks.filter(x => x.cat === cat && monthlyDone[x.id]).length; const p = Math.round(h/t*100); return (
                <div key={cat} style={{ background: "#fff", borderRadius: 3, padding: "12px 16px", border: "1px solid #DDD5C5", marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot }} />
                      <span style={{ fontWeight: 600, color: "#2D2D2D", fontSize: 13, ...S.sansFont }}>{cat}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#888", ...S.sansFont }}>{h}/{t} · <strong style={{ color: p === 100 ? "#2D8B5E" : col.text }}>{p}%</strong></span>
                  </div>
                  <div style={{ background: "#F0EDE6", borderRadius: 2, height: 5 }}>
                    <div style={{ width: `${p}%`, background: p === 100 ? "#2D8B5E" : col.border, height: "100%", borderRadius: 2, transition: "width 0.4s" }} />
                  </div>
                </div>
              ); })}
            </div>
          </>
        )}

        {tab === "log" && (
          <>
            <div style={{ fontSize: 12, color: "#AAA", marginBottom: 14, ...S.sansFont }}>Últimas {Math.min(history.length, 50)} acciones</div>
            {history.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#AAA", fontSize: 13, ...S.sansFont }}>Sin registros aún.</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {history.slice(0, 50).map((h, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #DDD5C5", borderRadius: 3, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, ...S.sansFont }}>
                    <PharmaCross size={12} color={h.tipo === "checkin" ? "#D4A820" : "#2D8B5E"} />
                    <span style={{ fontSize: 12, color: "#2D2D2D" }}>{h.tipo === "checkin" ? `Check-in ${h.turno === "am" ? "mañana" : "tarde"}` : h.titulo}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#AAA", ...S.sansFont }}>{fmtDate(h.fecha)} {fmtTime(h.fecha)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div style={{ background: "#FAFAF5", borderRadius: 4, padding: 28, width: "100%", maxWidth: 420, border: "1px solid #DDD5C5" }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 18, color: "#2D2D2D" }}>Nueva tarea</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {["dia", "mes"].map(tipo => (
                <button key={tipo} onClick={() => setAddForm({ ...addForm, tipo })} style={{ flex: 1, padding: "9px", borderRadius: 3, border: `1.5px solid ${addForm.tipo === tipo ? "#1B5E3B" : "#DDD5C5"}`, background: addForm.tipo === tipo ? "#1B5E3B" : "#fff", color: addForm.tipo === tipo ? "#fff" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", ...S.sansFont }}>
                  {tipo === "dia" ? "Diaria" : "Mensual"}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em", ...S.sansFont }}>Título</label>
              <input value={addForm.titulo} onChange={e => setAddForm({ ...addForm, titulo: e.target.value })} placeholder="Nombre de la tarea" style={{ width: "100%", padding: "9px 12px", borderRadius: 3, border: "1px solid #DDD5C5", fontSize: 14, marginTop: 4, boxSizing: "border-box", fontFamily: "'Sora', sans-serif" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em", ...S.sansFont }}>{addForm.tipo === "dia" ? "Notas" : "Descripción"}</label>
              <textarea value={addForm.tipo === "dia" ? addForm.notas : addForm.desc} onChange={e => setAddForm({ ...addForm, [addForm.tipo === "dia" ? "notas" : "desc"]: e.target.value })} rows={2} placeholder="Detalle opcional..." style={{ width: "100%", padding: "9px 12px", borderRadius: 3, border: "1px solid #DDD5C5", fontSize: 13, marginTop: 4, resize: "vertical", boxSizing: "border-box", ...S.sansFont }} />
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em", ...S.sansFont }}>Categoría</label>
                <select value={addForm.cat} onChange={e => setAddForm({ ...addForm, cat: e.target.value })} style={{ width: "100%", padding: "9px 10px", borderRadius: 3, border: "1px solid #DDD5C5", fontSize: 13, marginTop: 4, ...S.sansFont }}>
                  {Object.keys(addForm.tipo === "dia" ? CAT_COLORS : MCAT_COLORS).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {addForm.tipo === "mes" && <div style={{ width: 80 }}><label style={{ fontSize: 10, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em", ...S.sansFont }}>Día</label><input type="number" min={1} max={31} value={addForm.dia} onChange={e => setAddForm({ ...addForm, dia: Number(e.target.value) })} style={{ width: "100%", padding: "9px 10px", borderRadius: 3, border: "1px solid #DDD5C5", fontSize: 13, marginTop: 4, boxSizing: "border-box", ...S.sansFont }} /></div>}
              {addForm.tipo === "dia" && <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}><label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888", cursor: "pointer", ...S.sansFont }}><input type="checkbox" checked={addForm.urgente} onChange={e => setAddForm({ ...addForm, urgente: e.target.checked })} />Urgente</label></div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px", borderRadius: 3, border: "1px solid #DDD5C5", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#888", fontSize: 13, ...S.sansFont }}>Cancelar</button>
              <button onClick={addTask} disabled={!addForm.titulo.trim()} style={{ flex: 1, padding: "10px", borderRadius: 3, border: "none", background: addForm.titulo.trim() ? "#1B5E3B" : "#DDD5C5", color: addForm.titulo.trim() ? "#fff" : "#AAA", cursor: addForm.titulo.trim() ? "pointer" : "default", fontWeight: 600, fontSize: 13, ...S.sansFont }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: "fixed", bottom: 24, right: 24, background: "#1B5E3B", color: "#fff", padding: "10px 22px", borderRadius: 3, fontWeight: 600, fontSize: 13, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 200, ...S.sansFont }}>✓ {toast}</div>}
    </div>
  );
}

const _rootEl = document.getElementById('root');
if (_rootEl) ReactDOM.createRoot(_rootEl).render(<FarmaciaProf />);
