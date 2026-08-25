import { JeopardyGame } from "@/components/jeopardy-game";
import questions from "@/data/questions.json";

export default function Home() {
  return <JeopardyGame categories={questions} />;
}
