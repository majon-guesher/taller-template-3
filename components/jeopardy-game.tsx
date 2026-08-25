"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Question = {
  value: number;
  clue: string;
  answer: string;
};

type Category = {
  title: string;
  accent: string;
  questions: Question[];
};

type SelectedQuestion = Question & {
  category: string;
  key: string;
};

const accentClasses: Record<string, string> = {
  lime: "bg-[#dfff3f] text-[#161616]",
  pink: "bg-[#ff5da2] text-[#161616]",
  orange: "bg-[#ff7a2f] text-[#161616]",
  blue: "bg-[#5de1ff] text-[#161616]",
  violet: "bg-[#bda6ff] text-[#161616]",
};

export function JeopardyGame({ categories }: { categories: Category[] }) {
  const [scores, setScores] = useState([0, 0]);
  const [used, setUsed] = useState<string[]>([]);
  const [selected, setSelected] = useState<SelectedQuestion | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const totalQuestions = useMemo(
    () => categories.reduce((total, category) => total + category.questions.length, 0),
    [categories],
  );

  function openQuestion(category: Category, question: Question, index: number) {
    const key = `${category.title}-${index}`;
    setSelected({ ...question, category: category.title, key });
    setShowAnswer(false);
    setUsed((current) => (current.includes(key) ? current : [...current, key]));
  }

  function updateScore(team: number, amount: number) {
    setScores((current) =>
      current.map((score, index) => (index === team ? score + amount : score)),
    );
  }

  function awardPoints(team: number) {
    if (!selected) return;
    updateScore(team, selected.value);
    setSelected(null);
    setShowAnswer(false);
  }

  function resetGame() {
    setScores([0, 0]);
    setUsed([]);
    setSelected(null);
    setShowAnswer(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#121212] text-[#f7f2e8]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-3 py-4 sm:px-5 lg:px-8 lg:py-6">
        <header className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex items-start gap-3">
            <div className="mt-1 hidden size-11 rotate-3 items-center justify-center rounded-full bg-[#dfff3f] text-[#121212] sm:flex">
              <Sparkles className="size-5" strokeWidth={2.7} />
            </div>
            <div>
              <p className="mb-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#dfff3f] sm:text-xs">
                Majón presenta
              </p>
              <h1 className="font-display text-[clamp(2.8rem,7vw,6.6rem)] leading-[0.82] tracking-[-0.045em]">
                JEOPARDY <span className="text-[#ff5da2]">IA</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {[0, 1].map((team) => (
              <section
                key={team}
                className={cn(
                  "min-w-[155px] flex-1 border-2 border-[#f7f2e8] p-2.5 sm:min-w-[190px] lg:flex-none",
                  team === 1 && "bg-[#f7f2e8] text-[#121212]",
                )}
                aria-label={`Puntaje equipo ${team + 1}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] opacity-60">
                      Equipo {team + 1}
                    </p>
                    <p className="font-display text-3xl leading-none sm:text-4xl">{scores[team]}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full border border-current bg-transparent hover:bg-[#ff5da2] hover:text-[#121212]"
                      onClick={() => updateScore(team, -100)}
                      aria-label={`Restar 100 puntos al equipo ${team + 1}`}
                    >
                      <Minus />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full border border-current bg-transparent hover:bg-[#dfff3f] hover:text-[#121212]"
                      onClick={() => updateScore(team, 100)}
                      aria-label={`Sumar 100 puntos al equipo ${team + 1}`}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </section>
            ))}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11 rounded-full border border-[#f7f2e8]/35 text-[#f7f2e8] hover:bg-[#f7f2e8] hover:text-[#121212]"
              onClick={resetGame}
              aria-label="Reiniciar juego"
              title="Reiniciar juego"
            >
              <RotateCcw />
            </Button>
          </div>
        </header>

        <section
          className="grid flex-1 grid-cols-5 gap-1.5 sm:gap-2.5"
          aria-label="Tablero de preguntas"
        >
          {categories.map((category) => (
            <div key={category.title} className="grid min-w-0 grid-rows-[auto_repeat(5,1fr)] gap-1.5 sm:gap-2.5">
              <div
                className={cn(
                  "flex min-h-20 items-center justify-center px-1.5 py-3 text-center sm:min-h-24 sm:px-3",
                  accentClasses[category.accent] ?? accentClasses.lime,
                )}
              >
                <h2 className="font-display text-[clamp(0.72rem,1.75vw,1.65rem)] leading-[0.95] tracking-[-0.025em]">
                  {category.title}
                </h2>
              </div>

              {category.questions.map((question, index) => {
                const key = `${category.title}-${index}`;
                const isUsed = used.includes(key);

                return (
                  <button
                    key={question.value}
                    type="button"
                    onClick={() => openQuestion(category, question, index)}
                    className={cn(
                      "group relative flex min-h-16 items-center justify-center overflow-hidden border border-[#f7f2e8]/20 bg-[#242424] px-1 text-[#dfff3f] transition duration-200 hover:z-10 hover:-rotate-1 hover:scale-[1.03] hover:border-[#dfff3f] hover:bg-[#303030] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfff3f] sm:min-h-20",
                      isUsed && "bg-[#181818] text-[#f7f2e8]/20 line-through hover:text-[#f7f2e8]/60",
                    )}
                    aria-label={`${category.title} por ${question.value}${isUsed ? ", ya jugada" : ""}`}
                  >
                    <span className="font-display text-[clamp(1.35rem,3.5vw,3.5rem)] tracking-[-0.04em]">
                      {question.value}
                    </span>
                    {!isUsed && (
                      <span className="absolute bottom-1.5 size-1.5 rounded-full bg-[#ff5da2] opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </section>

        <footer className="mt-3 flex items-center justify-between gap-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#f7f2e8]/45 sm:text-xs">
          <p>Pensá → respondé → revelá</p>
          <p>{used.length} / {totalQuestions} jugadas</p>
        </footer>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setShowAnswer(false);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-5xl gap-0 overflow-y-auto rounded-none border-2 border-[#121212] bg-[#f7f2e8] p-0 text-[#121212] ring-0"
        >
          {selected && (
            <>
              <div className="flex items-center justify-between border-b-2 border-[#121212] bg-[#dfff3f] px-4 py-3 sm:px-6">
                <p className="font-bold uppercase tracking-[0.18em]">
                  {selected.category} · {selected.value} puntos
                </p>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-[#121212] hover:bg-[#121212] hover:text-[#f7f2e8]"
                    aria-label="Cerrar pregunta"
                  >
                    <X />
                  </Button>
                </DialogClose>
              </div>

              <div className="flex min-h-[300px] flex-col justify-center px-5 py-8 text-center sm:min-h-[430px] sm:px-12 sm:py-12">
                <DialogTitle className="sr-only">Pregunta por {selected.value} puntos</DialogTitle>
                <DialogDescription className="sr-only">
                  Pista de la categoría {selected.category}
                </DialogDescription>
                <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-[#ff438f]">
                  La pista
                </p>
                <p className="text-balance font-display text-[clamp(2rem,5.4vw,5.4rem)] leading-[1.02] tracking-[-0.04em]">
                  {selected.clue}
                </p>

                {showAnswer && (
                  <div className="mx-auto mt-8 w-full max-w-3xl border-t-2 border-[#121212] pt-6">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] opacity-50">
                      La respuesta
                    </p>
                    <p className="text-balance text-xl font-black sm:text-3xl">{selected.answer}</p>
                  </div>
                )}
              </div>

              <div className="grid border-t-2 border-[#121212] sm:grid-cols-3">
                {!showAnswer ? (
                  <Button
                    type="button"
                    className="col-span-full h-16 rounded-none bg-[#ff5da2] text-base font-black uppercase tracking-[0.16em] text-[#121212] hover:bg-[#e83d89] sm:h-20 sm:text-lg"
                    onClick={() => setShowAnswer(true)}
                  >
                    Revelar respuesta
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      className="h-16 rounded-none border-b-2 border-[#121212] bg-[#dfff3f] font-black uppercase tracking-[0.1em] text-[#121212] hover:bg-[#cbed2f] sm:h-20 sm:border-r-2 sm:border-b-0"
                      onClick={() => awardPoints(0)}
                    >
                      Puntos al equipo 1
                    </Button>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="h-16 rounded-none border-b-2 border-[#121212] bg-[#f7f2e8] font-black uppercase tracking-[0.1em] text-[#121212] hover:bg-[#ded7ca] sm:h-20 sm:border-r-2 sm:border-b-0"
                      >
                        Nadie suma
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      className="h-16 rounded-none bg-[#5de1ff] font-black uppercase tracking-[0.1em] text-[#121212] hover:bg-[#42cbe9] sm:h-20"
                      onClick={() => awardPoints(1)}
                    >
                      Puntos al equipo 2
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
