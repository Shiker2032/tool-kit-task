import { IExplorer } from '../types';

const Explorer = ({ items }: IExplorer) => {
  items.map((el) => el.node);

  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="card">
          <h3 className="title">{item.node.name}</h3>
          <p className="description">
            {' '}
            <span className="text_bold">Описание: </span>
            {item.node.description ? item.node.description : 'Отсутствует'}
          </p>
          <ul className="info-list">
            <li className="item">
              <p>
                <span className="text_bold">Обновлен: </span>{' '}
                {item.node.updatedAt}
              </p>
            </li>
            <li className="item">
              <p>
                <span className="text_bold">Звезды: </span>{' '}
                {item.node.stargazerCount}
              </p>
            </li>
            <li className="item">
              <span className="text_bold">Ссылка: </span>{' '}
              <a href={item.node.url}> {item.node.url}</a>
            </li>
          </ul>
        </div>
      ))}
    </>
  );
};

export default Explorer;
