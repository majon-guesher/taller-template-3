"use client";

import { useMemo, useState } from "react";
import data from "@/data/preguntas.json";

type PreguntaMultiple = {
  puntos: number;
  tipo: "multiple";
  pregunta: string;
  opciones: string[];
  correcta: number;
};
type PreguntaAbierta = {
  puntos: number;
  tipo: "abierta";
  pregunta: string;
  respuesta: string;
};
type PreguntaTabu = {
  puntos: number;
  tipo: "tabu";
  palabra: string;
  prohibidas: string[];
};
type Pregunta = PreguntaMultiple | PreguntaAbierta | PreguntaTabu;

type Categoria = { nombre: string; preguntas: Pregunta[] };

const categorias = (data as { categorias: Categoria[] }).categorias;
const TOTAL_PREGUNTAS = categorias.reduce((n, c) => n + c.preguntas.length, 0);

export default function Home() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [nombreA, setNombreA] = useState("Equipo Aleph");
  const [nombreB, setNombreB] = useState("Equipo Bet");
  const [usadas, setUsadas] = useState<Record<string, boolean>>({});
  const [activa, setActiva] = useState<{ ci: number; pi: number } | null>(null);
  const [revelada, setRevelada] = useState(false);
  const [final, setFinal] = useState(false);

  const completas = Object.keys(usadas).length;
  const todasHechas = completas >= TOTAL_PREGUNTAS;

  const preguntaActiva = useMemo(() => {
    if (!activa) return null;
    return categorias[activa.ci].preguntas[activa.pi];
  }, [activa]);

  function abrirPregunta(ci: number, pi: number) {
    const key = `${ci}-${pi}`;
    if (usadas[key]) return;
    setActiva({ ci, pi });
    setRevelada(false);
  }

  function cerrar(marcarUsada = true) {
    if (activa && marcarUsada) {
      const key = `${activa.ci}-${activa.pi}`;
      setUsadas((u) => ({ ...u, [key]: true }));
    }
    setActiva(null);
    setRevelada(false);
  }

  function sumar(equipo: "A" | "B", puntos: number) {
    if (equipo === "A") setScoreA((s) => s + puntos);
    else setScoreB((s) => s + puntos);
    cerrar(true);
  }

  function resetear() {
    setScoreA(0);
    setScoreB(0);
    setUsadas({});
    setActiva(null);
    setRevelada(false);
    setFinal(false);
  }

  return (
    <div className="min-h-screen w-full bg-[#1a1410] text-[#f5e9d4] flex-1 flex flex-col">
      {/* fondo textura piedra */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #d4a857 0, transparent 40%), radial-gradient(circle at 80% 70%, #b87333 0, transparent 50%), radial-gradient(circle at 50% 90%, #f5e9d4 0, transparent 60%)",
        }}
      />

      <header className="relative z-10 border-b border-[#3a2e22] px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-[family-name:var(--font-frank)] text-2xl text-[#d4a857] tracking-widest">
              ירושלים
            </p>
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl font-black tracking-wider text-[#f5e9d4]">
              IERUSHALAIM
            </h1>
          </div>
          <p className="font-[family-name:var(--font-cinzel)] text-xs sm:text-sm tracking-[0.3em] text-[#a89070]">
            {completas} / {TOTAL_PREGUNTAS} preguntas
          </p>
        </div>
      </header>

      {/* Marcador equipos */}
      <section className="relative z-10 px-6 sm:px-10 mt-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2">
          <Marcador
            color="amber"
            nombre={nombreA}
            setNombre={setNombreA}
            score={scoreA}
          />
          <Marcador
            color="rose"
            nombre={nombreB}
            setNombre={setNombreB}
            score={scoreB}
          />
        </div>
      </section>

      {/* Tablero */}
      <section className="relative z-10 px-6 sm:px-10 mt-8 mb-10 flex-1">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categorias.map((cat, ci) => (
              <div key={ci} className="flex flex-col gap-3 sm:gap-4">
                <div className="rounded-md border border-[#d4a857]/40 bg-gradient-to-b from-[#3a2e22] to-[#1a1410] px-3 py-4 text-center">
                  <h2 className="font-[family-name:var(--font-cinzel)] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#d4a857] leading-tight">
                    {cat.nombre}
                  </h2>
                </div>
                {cat.preguntas.map((p, pi) => {
                  const key = `${ci}-${pi}`;
                  const usada = usadas[key];
                  return (
                    <button
                      key={pi}
                      onClick={() => abrirPregunta(ci, pi)}
                      disabled={usada}
                      className={`group relative aspect-[3/2] rounded-md border-2 transition-all ${
                        usada
                          ? "border-[#3a2e22] bg-[#0f0a07] cursor-not-allowed"
                          : "border-[#d4a857]/60 bg-gradient-to-br from-[#2a2018] to-[#1a1410] hover:border-[#d4a857] hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(212,168,87,0.5)]"
                      }`}
                    >
                      {!usada && (
                        <span className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-5xl font-black text-[#d4a857] group-hover:text-[#f5d97a]">
                          {p.puntos}
                        </span>
                      )}
                      {usada && (
                        <span className="font-[family-name:var(--font-frank)] text-3xl text-[#3a2e22]">
                          ✦
                        </span>
                      )}
                      {!usada && (
                        <span className="absolute bottom-1.5 left-0 right-0 font-[family-name:var(--font-cinzel)] text-[10px] uppercase tracking-widest text-[#a89070]">
                          {p.tipo === "multiple"
                            ? "Opción múltiple"
                            : p.tipo === "abierta"
                            ? "Abierta"
                            : "A describir"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Botón terminar */}
          <div className="mt-10 flex flex-col items-center gap-3">
            {todasHechas && !final && (
              <p className="font-[family-name:var(--font-frank)] text-[#d4a857]">
                Listo, jugaron todas. Toquen para ver el ganador.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setFinal(true)}
                className="font-[family-name:var(--font-cinzel)] tracking-widest text-sm border-2 border-[#d4a857] px-6 py-3 rounded-md text-[#d4a857] hover:bg-[#d4a857] hover:text-[#1a1410] transition"
              >
                Terminar juego
              </button>
              <button
                onClick={resetear}
                className="font-[family-name:var(--font-cinzel)] tracking-widest text-sm border border-[#3a2e22] px-6 py-3 rounded-md text-[#a89070] hover:border-[#a89070] hover:text-[#f5e9d4] transition"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal pregunta */}
      {activa && preguntaActiva && (
        <Modal onClose={() => cerrar(false)}>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="font-[family-name:var(--font-cinzel)] text-xs tracking-[0.3em] text-[#a89070]">
                {categorias[activa.ci].nombre}
              </p>
              <p className="font-[family-name:var(--font-cinzel)] text-5xl font-black text-[#d4a857] mt-1">
                {preguntaActiva.puntos}
              </p>
            </div>
            <span className="font-[family-name:var(--font-cinzel)] text-[10px] uppercase tracking-widest border border-[#d4a857]/40 px-2 py-1 rounded text-[#d4a857]">
              {preguntaActiva.tipo === "multiple"
                ? "Opción múltiple"
                : preguntaActiva.tipo === "abierta"
                ? "Pregunta abierta"
                : "A describir"}
            </span>
          </div>

          {preguntaActiva.tipo === "multiple" && (
            <ContenidoMultiple
              p={preguntaActiva}
              revelada={revelada}
              setRevelada={setRevelada}
            />
          )}
          {preguntaActiva.tipo === "abierta" && (
            <ContenidoAbierta
              p={preguntaActiva}
              revelada={revelada}
              setRevelada={setRevelada}
            />
          )}
          {preguntaActiva.tipo === "tabu" && (
            <ContenidoTabu p={preguntaActiva} />
          )}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => sumar("A", preguntaActiva.puntos)}
              className="font-[family-name:var(--font-cinzel)] tracking-wider text-sm bg-amber-600/20 border-2 border-amber-500/60 text-amber-200 hover:bg-amber-500 hover:text-[#1a1410] px-4 py-3 rounded-md transition"
            >
              + {preguntaActiva.puntos} a {nombreA}
            </button>
            <button
              onClick={() => cerrar(true)}
              className="font-[family-name:var(--font-cinzel)] tracking-wider text-sm bg-transparent border-2 border-[#3a2e22] text-[#a89070] hover:border-[#a89070] hover:text-[#f5e9d4] px-4 py-3 rounded-md transition"
            >
              Nadie acertó
            </button>
            <button
              onClick={() => sumar("B", preguntaActiva.puntos)}
              className="font-[family-name:var(--font-cinzel)] tracking-wider text-sm bg-rose-600/20 border-2 border-rose-500/60 text-rose-200 hover:bg-rose-500 hover:text-[#1a1410] px-4 py-3 rounded-md transition"
            >
              + {preguntaActiva.puntos} a {nombreB}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal final */}
      {final && (
        <Modal onClose={() => setFinal(false)}>
          <Ganador
            scoreA={scoreA}
            scoreB={scoreB}
            nombreA={nombreA}
            nombreB={nombreB}
          />
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setFinal(false)}
              className="font-[family-name:var(--font-cinzel)] tracking-widest text-sm border border-[#3a2e22] px-6 py-3 rounded-md text-[#a89070] hover:text-[#f5e9d4] hover:border-[#a89070] transition"
            >
              Volver al tablero
            </button>
            <button
              onClick={resetear}
              className="font-[family-name:var(--font-cinzel)] tracking-widest text-sm border-2 border-[#d4a857] bg-[#d4a857] text-[#1a1410] px-6 py-3 rounded-md hover:bg-[#f5d97a] transition"
            >
              Jugar de nuevo
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Marcador({
  color,
  nombre,
  setNombre,
  score,
}: {
  color: "amber" | "rose";
  nombre: string;
  setNombre: (s: string) => void;
  score: number;
}) {
  const palette =
    color === "amber"
      ? "from-amber-900/40 to-[#1a1410] border-amber-500/40 text-amber-300"
      : "from-rose-900/40 to-[#1a1410] border-rose-500/40 text-rose-300";
  return (
    <div
      className={`rounded-lg border-2 ${palette} bg-gradient-to-br px-5 py-4 flex items-center justify-between gap-4`}
    >
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="bg-transparent font-[family-name:var(--font-cinzel)] tracking-wider text-lg sm:text-xl font-bold focus:outline-none focus:ring-1 focus:ring-current rounded px-1 w-full max-w-xs"
      />
      <div className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl font-black tabular-nums">
        {score}
      </div>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-lg border-2 border-[#d4a857]/60 bg-gradient-to-br from-[#2a2018] to-[#1a1410] p-6 sm:p-10 shadow-[0_0_60px_-10px_rgba(212,168,87,0.4)] max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-[#a89070] hover:text-[#f5e9d4] text-2xl leading-none"
          aria-label="Cerrar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function ContenidoMultiple({
  p,
  revelada,
  setRevelada,
}: {
  p: PreguntaMultiple;
  revelada: boolean;
  setRevelada: (b: boolean) => void;
}) {
  const letras = ["A", "B", "C", "D"];
  return (
    <div>
      <p className="font-[family-name:var(--font-frank)] text-xl sm:text-2xl leading-relaxed text-[#f5e9d4]">
        {p.pregunta}
      </p>
      <div className="mt-6 grid gap-3">
        {p.opciones.map((op, i) => {
          const esCorrecta = i === p.correcta;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-md border ${
                revelada && esCorrecta
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-200"
                  : "border-[#3a2e22] bg-[#1a1410]/60 text-[#f5e9d4]"
              }`}
            >
              <span className="font-[family-name:var(--font-cinzel)] font-bold text-[#d4a857] w-6">
                {letras[i]}
              </span>
              <span className="font-[family-name:var(--font-frank)] text-lg">
                {op}
              </span>
            </div>
          );
        })}
      </div>
      {!revelada && (
        <button
          onClick={() => setRevelada(true)}
          className="mt-5 font-[family-name:var(--font-cinzel)] text-xs tracking-widest text-[#d4a857] hover:text-[#f5d97a] uppercase"
        >
          Revelar respuesta
        </button>
      )}
    </div>
  );
}

function ContenidoAbierta({
  p,
  revelada,
  setRevelada,
}: {
  p: PreguntaAbierta;
  revelada: boolean;
  setRevelada: (b: boolean) => void;
}) {
  return (
    <div>
      <p className="font-[family-name:var(--font-frank)] text-xl sm:text-2xl leading-relaxed text-[#f5e9d4]">
        {p.pregunta}
      </p>
      <div className="mt-6">
        {revelada ? (
          <div className="rounded-md border border-emerald-500 bg-emerald-500/15 px-4 py-4">
            <p className="font-[family-name:var(--font-cinzel)] text-xs tracking-widest text-emerald-300 uppercase mb-1">
              Respuesta
            </p>
            <p className="font-[family-name:var(--font-frank)] text-lg text-emerald-100">
              {p.respuesta}
            </p>
          </div>
        ) : (
          <button
            onClick={() => setRevelada(true)}
            className="font-[family-name:var(--font-cinzel)] tracking-widest text-sm border border-[#d4a857] text-[#d4a857] hover:bg-[#d4a857] hover:text-[#1a1410] px-5 py-2 rounded-md transition uppercase"
          >
            Revelar respuesta
          </button>
        )}
      </div>
    </div>
  );
}

function ContenidoTabu({ p }: { p: PreguntaTabu }) {
  return (
    <div>
      <p className="font-[family-name:var(--font-cinzel)] text-xs tracking-[0.3em] text-[#a89070] uppercase">
        El jugador hace adivinar
      </p>
      <p className="mt-2 font-[family-name:var(--font-cinzel)] text-3xl sm:text-5xl font-black text-[#d4a857] tracking-wider">
        {p.palabra}
      </p>
      <div className="mt-6 rounded-md border-2 border-rose-700/60 bg-rose-950/30 p-5">
        <p className="font-[family-name:var(--font-cinzel)] text-xs tracking-[0.3em] text-rose-300 uppercase">
          Palabras prohibidas
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {p.prohibidas.map((w, i) => (
            <li
              key={i}
              className="font-[family-name:var(--font-frank)] text-base px-3 py-1.5 rounded-full border border-rose-500/60 bg-rose-900/40 text-rose-100 line-through decoration-rose-400/70"
            >
              {w}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Ganador({
  scoreA,
  scoreB,
  nombreA,
  nombreB,
}: {
  scoreA: number;
  scoreB: number;
  nombreA: string;
  nombreB: string;
}) {
  const empate = scoreA === scoreB;
  const ganadorNombre = scoreA > scoreB ? nombreA : nombreB;
  return (
    <div className="text-center">
      <p className="font-[family-name:var(--font-frank)] text-2xl text-[#d4a857] tracking-widest">
        מזל טוב
      </p>
      {empate ? (
        <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl font-black text-[#f5e9d4]">
          ¡Empate!
        </h2>
      ) : (
        <>
          <p className="mt-3 font-[family-name:var(--font-cinzel)] text-xs tracking-[0.4em] text-[#a89070] uppercase">
            Ganador
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-cinzel)] text-4xl sm:text-6xl font-black text-[#d4a857] tracking-wide">
            {ganadorNombre}
          </h2>
        </>
      )}
      <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="rounded-lg border-2 border-amber-500/40 bg-amber-900/20 px-4 py-5">
          <p className="font-[family-name:var(--font-cinzel)] text-xs tracking-widest text-amber-300 uppercase">
            {nombreA}
          </p>
          <p className="font-[family-name:var(--font-cinzel)] text-4xl font-black text-amber-200 mt-1 tabular-nums">
            {scoreA}
          </p>
        </div>
        <div className="rounded-lg border-2 border-rose-500/40 bg-rose-900/20 px-4 py-5">
          <p className="font-[family-name:var(--font-cinzel)] text-xs tracking-widest text-rose-300 uppercase">
            {nombreB}
          </p>
          <p className="font-[family-name:var(--font-cinzel)] text-4xl font-black text-rose-200 mt-1 tabular-nums">
            {scoreB}
          </p>
        </div>
      </div>
    </div>
  );
}
