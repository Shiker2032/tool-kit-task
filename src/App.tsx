//@ts-nocheck

import { useEffect, useState } from 'react';
import './App.scss';
import Pagination from './components/Pagination';
import Explorer from './components/Explorer';
import { EdgeNode } from './types';

const token = import.meta.env.VITE_TOKEN;
const PAGE_SIZE = 5;

const queryBuilder = (query: string) => {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  }).then((res) => res.json());
};

const getAll = async () => {
  const result = await queryBuilder(`
  {
    search(query: "code in :name", type: REPOSITORY, first: 10) {
      edges {
        node {
          ... on Repository {
            name
          }
        }
      }
    }
  }`); 
};

const getTotalPages = () => {
  return queryBuilder(`
  {
    search(query: "code in :name", type: REPOSITORY, first: 10) {
      repositoryCount
    }
  }
  `).then((json) => (json.data.search.repositoryCount))
};

const getCursor = async (pageSize: number, prev: string) => {
  const direction = prev ? `after:"${prev}"` : '';
  const {data:{search:{pageInfo:{endCursor}}}} = await queryBuilder(`
  {
    search(query: "code in :name", type: REPOSITORY, first: 10, ${direction}) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }`);
  return endCursor
};

function App() {
  const [pageCursors, setPagesCursors] = useState(['']);
  const [repositoriesList, setRepositoriesList] = useState<EdgeNode[]>([
    {
      node: {
        description: 'Описание',
        name: 'Имя',
        stargazerCount: 0,
        updatedAt: 'Дата обновления',
        url: 'ссылка',
      },
    },
  ]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActiveUser] = useState('');

  const getCursors = async () => {
    const totalPages = Math.ceil((await getTotalPages()) / PAGE_SIZE);        
    const cursors = [''];
    setTotalPages(totalPages);

    for (let i = 0; i <= totalPages && i < 10; i++) {      
      if (i !== 0) {
        const cursor = await getCursor(PAGE_SIZE, cursors[i - 1]);
        cursors.push(cursor);
      }
    }
    return cursors;
  };

  const getUser = async () => {
    return await queryBuilder (`
    query { 
      viewer { 
        login
      }
    }
    `)
  } 

  const setInitData = async () => {
    setIsLoading(true);
    const pages = await getCursors();
    const {data:{search:{edges}}} = await getPage(1);   
    const user = await getUser();

    edges.forEach(
      (edge: EdgeNode) =>
        (edge.node.updatedAt = new Date(
          edge.node.updatedAt
        ).toLocaleDateString())
    );
    setActiveUser(user.data.viewer.login);    
    setRepositoriesList(edges.map((el: EdgeNode) => el));
    setPagesCursors(pages);
    setIsLoading(false);
  };

  const handlePageClick = async (evt: React.ChangeEvent<HTMLUListElement>) => {
    const page: string =
      evt.target.textContent !== null ? evt.target.textContent : '0';
      const {data:{search:{edges}}} = await getPage(parseInt(page));
      edges.forEach(
        (edge: EdgeNode) =>
          (edge.node.updatedAt = new Date(
            edge.node.updatedAt
          ).toLocaleDateString())
      );
      setRepositoriesList(edges.map((el: EdgeNode) => el));
         
  
  };

  const getPage = async (page: number) => {
    if (page == 1) {
      return await queryBuilder(`
      {
        search(query: "code in :name", type: REPOSITORY, first: 10) {
          edges {
            node {
              ... on Repository {
                name
                updatedAt
                stargazerCount
                description
              }
            }
          }
        }
      }
      `);
    } else {
      return await queryBuilder(`
      {
        search(query: "code in :name", type: REPOSITORY, first: 10, after:"${pageCursors[page-1]}") {
          edges {
            node {
              ... on Repository {
                name
                updatedAt
                stargazerCount
                description
              }
            }
          }
        }
      }
      `);
    }
  };

  useEffect(() => {
    setInitData();
    getAll();
  }, []);

  const handleSearch = async () => {
    const input = document.getElementById("search");    
    const result = await getData();
        
  }

  const getData   = async (query:string) => {
    return await queryBuilder(`
    {
      search(query: "code in :name", type: REPOSITORY, first: 10) {
        edges {
          node {
            ... on Repository {
              name
            }
          }
        }
      }
    }
    `)
  }

  return (
    <section className="home">
      <div className="container">
        <label > поиск:
          <input id='search' type="text" />
        </label>
        <button onClick={handleSearch}>Найти</button>
        <div className="explorer">
          {isLoading ? (
            <p style={{ textAlign: 'center' }}>Загрузка...</p>
          ) : (
            <Explorer items={repositoriesList}></Explorer>
          )}
        </div>
        <div className="pagination">
          <Pagination pages={totalPages} handleClick={handlePageClick} />
        </div>
      </div>
    </section>
  );
}

export default App;
