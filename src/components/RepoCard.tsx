import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { queryFetcher } from '../utilts/utilts';
import { IRepoCard } from '../types/repo-card';

const RepoCard = () => {
  const [repoInfo, setRepoInfo] = useState<IRepoCard>();
  const { repoId } = useParams();

  const loadData = async () => {
    const query = `
        {
            search(query: "repo:${repoId?.replace(
              '$',
              '/'
            )},", type: REPOSITORY, first: 1) {
                edges {
                    node {
                      ... on Repository {
                        name        
                        stargazerCount
                        updatedAt
                        url
                        id       
                        languages {
                          edges {
                            node {
                              id
                            }
                          }
                        }
                        description
                        owner {
                          login
                          url
                          avatarUrl
                        }
                      }
                    }
                  }
                }
              }`;

    const {
      data: {
        search: { edges },
      },
    } = await queryFetcher(query);
    setRepoInfo(edges[0]);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="repository-card">
      <div className="content container">
        {repoInfo?.node && (
          <div className="info">
            <div className="owner">
              <img src={repoInfo.node.owner.avatarUrl}></img>
              <p>Ник владельца: {repoInfo.node.owner.login}</p>
              <a target="/blank" href={repoInfo.node.owner.url}>
                Профиль
              </a>
            </div>
            <div className="repository">
              <p>Название: {repoInfo.node.name}</p>
              <p>кол-во звёзд: {repoInfo.node.stargazerCount}</p>
              <p>Обновлен: {repoInfo.node.updatedAt}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoCard;
