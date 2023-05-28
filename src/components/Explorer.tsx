//@ts-nocheck

interface IExplorer {
  items: [];
}

const Explorer = ({ items }: IExplorer) => {
  return (
    <>
      {items.map((item: { name }, i) => (
        <div key={i} className="card">
          <h3 className="title">{item.name}</h3>
          <p className="description">
            {' '}
            <span className="text_bold">Описание: </span>
            {item.description ? item.description : 'Отсутствует'}
          </p>
          <ul className="info-list">
            <li className="item">
              <p>
                <span className="text_bold">Обновлен: </span> {item.updatedAt}
              </p>
            </li>
            <li className="item">
              <p>
                <span className="text_bold">Звезды: </span>{' '}
                {item.stargazerCount}
              </p>
            </li>
            <li className="item">
              <span className="text_bold">Ссылка: </span>{' '}
              <a href={item.url}> {item.url}</a>
            </li>
          </ul>
        </div>
      ))}
    </>
  );
};

export default Explorer;
