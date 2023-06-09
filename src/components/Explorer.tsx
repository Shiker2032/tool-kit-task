

import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from '../store/hooks/useAppDispatch';

const Explorer = () => {
  const { repos } = useTypedSelector((store) => store.repos);

  const handleCardClick = (repoId: string) => {
    navigate(`/repositories/${repoId.replace('/', '$')}`);
  };

  const navigate = useNavigate();

  return (
    <>
      {repos &&
        repos.map((item, i) => (
          <div key={i} className="card">
            <h3
              onClick={() => handleCardClick(item.node.nameWithOwner)}
              className="title"
            >
              {item.node.name}
            </h3>
            <p className="description">
              {' '}
              <span className="text_bold">Описание: </span>
              {item.node.description ? item.node.description : 'Отсутствует'}
            </p>
            <ul className="info-list">
              <li className="item">
                <span className="text_bold">Обновлен: </span>{' '}
                {item.node.updatedAt}
              </li>
              <li className="item">
                <span className="text_bold">Звезды: </span>{' '}
                <p id="stars-amount">{item.node.stargazerCount}</p>
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
