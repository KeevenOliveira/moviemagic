import Card, { CardProps } from "@/components/Card";

export interface CardListProps {
  title: string;
  cards: CardProps[];
}

const CardList = ({ title, cards }: CardListProps) => {
  return (
    <>
      <h2 className="text-xl p-3">{title}</h2>
      <div className="w-full overflow-x-scroll scrollbar scrollbar-thumb-slate-500 scrollbar-track-gray-800 whitespace-nowrap mt-3 scroll-">
        <div data-testid="card-list" className="flex">
          {cards?.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CardList;
