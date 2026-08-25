"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, RotateCcw, Sparkles, X } from "lucide-react";

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
  kind: string;
  clue: string;
  answer: string;
  options?: string[];
  forbidden?: string[];
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
};

const modeLabels: Record<string, string> = {
  choice: "Multiple choice",
  open: "Pregunta abierta",
  taboo: "Palabras prohibidas",
};

export function JeopardyGame({ categories }: { categories: Category[] }) {
  const [scores, setScores] = useState([0, 0]);
  const [used, setUsed] = useState<string[]>([]);
  const [selected, setSelected] = useState<SelectedQuestion | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const totalQuestions = useMemo(
    () => categories.reduce((total, category) => total + category.questions.length, 0),
    [categories],
  );

  function openQuestion(category: Category, question: Question, index: number) {
    const key = `${category.title}-${index}`;
    setSelected({ ...question, category: category.title, key });
    setShowAnswer(false);
    setSelectedOption(null);
    setUsed((current) => (current.includes(key) ? current : [...current, key]));
  }

  function closeQuestion() {
    setSelected(null);
    setShowAnswer(false);
    setSelectedOption(null);
  }

  function chooseOption(option: string) {
    if (!selectedOption) {
      setSelectedOption(option);
      setShowAnswer(true);
    }
  }

  function updateScore(team: number, amount: number) {
    setScores((current) =>
      current.map((score, index) => (index === team ? score + amount : score)),
    );
  }

  function awardPoints(team: number) {
    if (!selected) return;
    updateScore(team, selected.value);
    closeQuestion();
  }

  function resetGame() {
    setScores([0, 0]);
    setUsed([]);
    closeQuestion();
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
              <h1 className="font-display text-[clamp(2.4rem,6vw,5.8rem)] leading-[0.82] tracking-[-0.045em]">
                IERUSHALAIM <span className="text-[#ff5da2]">3000</span>
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
                    <Button type="button" variant="ghost" size="icon" className="rounded-full border border-current bg-transparent hover:bg-[#ff5da2] hover:text-[#121212]" onClick={() => updateScore(team, -100)} aria-label={`Restar 100 puntos al equipo ${team + 1}`}>
                      <Minus />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full border border-current bg-transparent hover:bg-[#dfff3f] hover:text-[#121212]" onClick={() => updateScore(team, 100)} aria-label={`Sumar 100 puntos al equipo ${team + 1}`}>
                      <Plus />
                    </Button>
                  </div>
                </div>
              </section>
            ))}

            <Button type="button" variant="ghost" size="icon" className="size-11 rounded-full border border-[#f7f2e8]/35 text-[#f7f2e8] hover:bg-[#f7f2e8] hover:text-[#121212]" onClick={resetGame} aria-label="Reiniciar juego" title="Reiniciar juego">
              <RotateCcw />
            </Button>
          </div>
        </header>

        <section className="grid flex-1 grid-cols-4 gap-1.5 sm:gap-2.5" aria-label="Tablero de preguntas sobre Ierushalaim">
          {categories.map((category) => (
            <div key={category.title} className="grid min-w-0 grid-rows-[auto_repeat(3,1fr)] gap-1.5 sm:gap-2.5">
              <div className={cn("flex min-h-20 items-center justify-center px-1.5 py-3 text-center sm:min-h-24 sm:px-3", accentClasses[category.accent] ?? accentClasses.lime)}>
                <h2 className="font-display text-[clamp(0.82rem,2.3vw,2.1rem)] leading-[0.95] tracking-[-0.025em]">{category.title}</h2>
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
                      "group relative flex min-h-24 flex-col items-center justify-center overflow-hidden border border-[#f7f2e8]/20 bg-[#242424] px-1 text-[#dfff3f] transition duration-200 hover:z-10 hover:-rotate-1 hover:scale-[1.025] hover:border-[#dfff3f] hover:bg-[#303030] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfff3f] sm:min-h-32",
                      isUsed && "bg-[#181818] text-[#f7f2e8]/20 line-through hover:text-[#f7f2e8]/60",
                    )}
                    aria-label={`${category.title} por ${question.value}, ${modeLabels[question.kind]}${isUsed ? ", ya jugada" : ""}`}
                  >
                    <span className="font-display text-[clamp(1.8rem,5vw,4.8rem)] leading-none tracking-[-0.04em]">{question.value}</span>
                    <span className="mt-2 max-w-[90%] text-[0.5rem] font-black uppercase tracking-[0.12em] text-[#f7f2e8]/45 no-underline sm:text-[0.65rem]">{modeLabels[question.kind]}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </section>

        <footer className="mt-3 flex items-center justify-between gap-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#f7f2e8]/45 sm:text-xs">
          <p>100 elegí · 200 respondé · 300 hacé adivinar</p>
          <p>{used.length} / {totalQuestions} jugadas</p>
        </footer>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && closeQuestion()}>
        <DialogContent showCloseButton={false} className="max-h-[96vh] min-h-[86vh] w-[calc(100%-1rem)] max-w-[min(96vw,90rem)] grid-rows-[auto_1fr_auto] gap-0 overflow-y-auto rounded-none border-2 border-[#121212] bg-[#f7f2e8] p-0 text-[#121212] ring-0 sm:w-[96vw]">
          {selected && (
            <>
              <div className="flex items-center justify-between border-b-2 border-[#121212] bg-[#dfff3f] px-4 py-3 sm:px-7 sm:py-4">
                <div>
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-55 sm:text-xs">{modeLabels[selected.kind]}</p>
                  <p className="font-bold uppercase tracking-[0.12em] sm:text-lg">{selected.category} · {selected.value} puntos</p>
                </div>
                <DialogClose asChild>
                  <Button type="button" variant="ghost" size="icon" className="rounded-full border border-[#121212] hover:bg-[#121212] hover:text-[#f7f2e8]" aria-label="Cerrar pregunta"><X /></Button>
                </DialogClose>
              </div>

              <div className="flex min-h-0 flex-col items-center justify-center px-5 py-6 text-center sm:px-12 sm:py-8 lg:px-20">
                <DialogTitle className="sr-only">Pregunta por {selected.value} puntos</DialogTitle>
                <DialogDescription className="sr-only">Consigna de la categoría {selected.category}</DialogDescription>

                {selected.kind === "taboo" ? (
                  <TabooRound question={selected} finished={showAnswer} />
                ) : (
                  <>
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff438f] sm:mb-5">La pregunta</p>
                    <p className="max-w-6xl text-balance font-display text-[clamp(1.65rem,4vw,4.6rem)] leading-[1.03] tracking-[-0.04em]">{selected.clue}</p>

                    {selected.kind === "choice" && selected.options && (
                      <div className="mt-6 grid w-full max-w-5xl gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3">
                        {selected.options.map((option, index) => {
                          const isCorrect = option === selected.answer;
                          const wasChosen = option === selectedOption;

                          return (
                            <button
                              key={option}
                              type="button"
                              disabled={selectedOption !== null}
                              onClick={() => chooseOption(option)}
                              className={cn(
                                "flex min-h-14 items-center border-2 border-[#121212] bg-white px-4 py-3 text-left text-base font-black transition hover:-translate-y-0.5 hover:bg-[#dfff3f] disabled:translate-y-0 disabled:cursor-default sm:min-h-20 sm:px-6 sm:text-xl",
                                showAnswer && isCorrect && "bg-[#dfff3f]",
                                showAnswer && wasChosen && !isCorrect && "bg-[#ff8ab9]",
                                showAnswer && !isCorrect && !wasChosen && "opacity-45",
                              )}
                            >
                              <span className="mr-3 flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-current text-xs sm:size-9 sm:text-sm">{String.fromCharCode(65 + index)}</span>
                              {option}
                              {showAnswer && isCorrect && <Check className="ml-auto size-6" strokeWidth={3} />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {selected.kind === "open" && showAnswer && (
                      <div className="mx-auto mt-8 w-full max-w-4xl border-t-2 border-[#121212] pt-5 sm:pt-7">
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] opacity-50">Respuesta</p>
                        <p className="text-balance text-2xl font-black sm:text-4xl lg:text-5xl">{selected.answer}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="grid border-t-2 border-[#121212] sm:grid-cols-3">
                {!showAnswer && selected.kind !== "choice" ? (
                  <Button type="button" className="col-span-full h-16 rounded-none bg-[#ff5da2] text-base font-black uppercase tracking-[0.16em] text-[#121212] hover:bg-[#e83d89] sm:h-20 sm:text-lg" onClick={() => setShowAnswer(true)}>
                    {selected.kind === "taboo" ? "Terminar ronda" : "Revelar respuesta"}
                  </Button>
                ) : showAnswer ? (
                  <>
                    <Button type="button" className="h-16 rounded-none border-b-2 border-[#121212] bg-[#dfff3f] font-black uppercase tracking-[0.1em] text-[#121212] hover:bg-[#cbed2f] sm:h-20 sm:border-r-2 sm:border-b-0" onClick={() => awardPoints(0)}>Puntos al equipo 1</Button>
                    <Button type="button" className="h-16 rounded-none border-b-2 border-[#121212] bg-[#f7f2e8] font-black uppercase tracking-[0.1em] text-[#121212] hover:bg-[#ded7ca] sm:h-20 sm:border-r-2 sm:border-b-0" onClick={closeQuestion}>Nadie suma</Button>
                    <Button type="button" className="h-16 rounded-none bg-[#5de1ff] font-black uppercase tracking-[0.1em] text-[#121212] hover:bg-[#42cbe9] sm:h-20" onClick={() => awardPoints(1)}>Puntos al equipo 2</Button>
                  </>
                ) : (
                  <p className="col-span-full flex h-14 items-center justify-center bg-[#121212] px-4 text-center text-xs font-black uppercase tracking-[0.15em] text-[#f7f2e8]/65 sm:h-16 sm:text-sm">Elegí una opción para revelar la correcta</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function TabooRound({ question, finished }: { question: SelectedQuestion; finished: boolean }) {
  return (
    <div className="w-full max-w-6xl">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff438f]">Hacé que el resto adivine</p>
      <p className="text-balance font-display text-[clamp(2.2rem,6vw,6.8rem)] leading-[0.95] tracking-[-0.05em]">{question.answer}</p>

      <div className="mx-auto mt-5 max-w-4xl border-y-2 border-[#121212] py-4 sm:mt-7 sm:py-6">
        <p className="mb-2 text-[0.65rem] font-black uppercase tracking-[0.22em] opacity-45">Definición de ayuda</p>
        <p className="text-balance text-base font-bold leading-snug sm:text-2xl">{question.clue}</p>
      </div>

      <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] sm:mt-7">No podés decir</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2 sm:gap-3">
        {question.forbidden?.map((word) => (
          <span key={word} className="border-2 border-[#121212] bg-[#ff5da2] px-4 py-2 text-base font-black uppercase sm:px-6 sm:py-3 sm:text-2xl">{word}</span>
        ))}
      </div>

      {finished && <p className="mt-6 font-black uppercase tracking-[0.18em] text-[#ff438f]">Tiempo. ¿Lo adivinaron?</p>}
    </div>
  );
}
