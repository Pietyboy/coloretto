import { Drawer, Image, Typography } from "../../../shared/ui/components";

const { Paragraph, Title } = Typography;

type TRuleSidebarProps = {
  isSidebarOpen: boolean;
  onSidebarClose: (isOpen: boolean) => void;
};

export const RuleSidebar = (props: TRuleSidebarProps) => {
  const { isSidebarOpen, onSidebarClose } = props;
  return (
    <Drawer closeIcon={<Image variant="closeIcon"/>} open={isSidebarOpen} onClose={() => onSidebarClose(false)}>
      <Title level={3}>
        Краткие правила
      </Title>
      <Paragraph>
        <Title level={5}>Ход игрока:</Title>
        <Paragraph>
          В свой ход игрок делает одно из двух действий:<br/>А. Вытянуть верхнюю карту из колоды и положить её в один из рядов (в ряду может быть максимум 3 карты).<br/>Б. Взять один из рядов себе (вместе с картой начала ряда). После этого игрок пропускает оставшуюся часть раунда.
        </Paragraph>
      </Paragraph>
      <Paragraph>
        Раунд продолжается, пока все игроки не возьмут по одному ряду.
        После этого начинается новый раунд. Первым ходит тот, кто последним взял ряд.
      </Paragraph>
      <Paragraph>
        <Title level={5}>Конец игры:</Title>
        Когда в колоде не остается карт — начинается последний раунд. После его окончания игроки решают, к каким цветам добавить свои джокеры, и какие цвета будут нести положительные очки.
      </Paragraph>
      <Paragraph>
        <Title level={5}>Подсчёт очков:</Title>
        1 карта = 1 очко<br/>
        2 карты = 3 очка<br/>
        3 карты = 6 очков<br/>
        4 карты = 10 очков<br/>
        5 карт = 15 очков<br/>
        6+ карт = 21 очко<br/>
        Каждая карта «+2» = +2 очка
      </Paragraph>
      <Paragraph>
        Игрок выбирает три цвета, приносящие положительные очки, все остальные цвета дают отрицательные очки по той же таблице.
      </Paragraph>
    </Drawer>
  );
}
