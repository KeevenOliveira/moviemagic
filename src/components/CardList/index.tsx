import Card, { CardProps } from "@/components/Card";
import EmptyState from "@/components/EmptyState";

export interface CardListProps {
  title: string;
  cards: CardProps[];
  variant?: "default" | "embedded";
}

const CardList = ({ title, cards, variant = "default" }: CardListProps) => {
  const isEmpty = !cards || cards.length === 0;
  const emptyTitle = title?.trim() ? title.trim() : "os filmes";

  const content = isEmpty ? (
    <div data-testid="card-list" className={variant === "default" ? "p-4" : ""}>
      <EmptyState
        title={`Não foi possível carregar ${emptyTitle} agora`}
        description="Parece que estamos com instabilidade para buscar os filmes. Tente novamente em instantes."
        actionLabel="Ir para busca"
        actionHref="/search"
      />
    </div>
  ) : (
    <div className="w-full overflow-x-auto scrollbar scrollbar-thumb-slate-500/70 scrollbar-track-transparent">
      <div data-testid="card-list" className="flex gap-4 px-1 py-4">
        {cards?.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
    </div>
  );

  return (
    <section className={variant === "default" ? "mt-8" : ""}>
      {variant === "default" && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          <span className="mm-chip hidden sm:inline-flex">Explore</span>
        </div>
      )}

      {variant === "default" ? (
        <div className="mt-4 mm-glass rounded-2xl">
          {content}
        </div>
      ) : (
        content
      )}
    </section>
  );
};

export default CardList;
