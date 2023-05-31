//@ts-nocheck

import { useEffect, useState } from 'react';
import './App.scss';
import Pagination from './components/Pagination';
import Explorer from './components/Explorer';
import { EdgeNode } from './types';

const token = import.meta.env.VITE_TOKEN;
const PAGE_SIZE = 5;

const queryFetcher = (query: string) => {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  }).then((res) => res.json());
};

const queryBuilder = async (type: string, prev: string = "",) => {  
  const searchName = document.getElementById("search-name");
  const searchStars = document.getElementById("search-stars");  
  const searchDate = document.getElementById("search-date");

  
  var searchParams = '';  
  var prevParams = '';
  var query = '';

  if (searchName.value) {
    searchParams += `${searchName.value} in :name,`    
  }

  if (searchStars.value) {
    searchParams += `stars:>=${searchStars.value},`
  }  

  if (searchDate.value) {
    searchParams += `pushed:>${searchDate.value},`
  }

  if (prev) {
    prevParams += `, after:"${prev}"`
  }

  switch (type) {
    case "getCursor":
      query = `  {
        search(query: "${searchParams}", type: REPOSITORY, first: 10, ${prevParams}) {
          pageInfo {
            startCursor
            endCursor
            hasNextPage
          }
        }
      }`
      break;
    case "totalPages":
      query =
        `{
        search(query: "${searchParams}", type: REPOSITORY, first: ${PAGE_SIZE}) {
          repositoryCount
        }
      }
      `
      break;
    case "repositoryPage":
      query = `
  {
    search(query: "${searchParams}", type: REPOSITORY, first: ${PAGE_SIZE} ${prevParams}) {
      edges {
        node {
          ... on Repository {
            name
            description
            stargazerCount
            updatedAt
            url
          }
        }
      }
    }
  }  
  `
  break;
  default: "no type";
  }
  return query;
};

const getTotalPages = async () => {
  const queryForTotalPages = await (queryBuilder("totalPages",""))  
  const { data: { search: { repositoryCount } } } = await queryFetcher(queryForTotalPages);
  return repositoryCount  
};

const getCursor = async (pageSize: number, prev: string) => {
  const direction = prev ? `after:"${prev}"` : '';
  const { data: { search: { pageInfo: { endCursor } } } } = await queryFetcher(`
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
        const getCursorQuery = await queryBuilder("getCursor", cursors[i-1]);
        const {data:{search:{pageInfo:{endCursor}}}} = await queryFetcher(getCursorQuery);
        cursors.push(endCursor);     
      }
    }
    return cursors;
  };

  const getUser = async () => {
    return await queryFetcher(`
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
    const { data: { search: { edges } } } = await getPage(1);
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
    const { data: { search: { edges } } } = await getPage(parseInt(page));
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
      const queryForFirstPage = await queryBuilder("repositoryPage", "");
      return await queryFetcher(queryForFirstPage);

    } else {
      const queryForPage = await queryBuilder("repositoryPage", pageCursors[page - 1]);
      return await queryFetcher(queryForPage);

    }
  };

  useEffect(() => {
    setInitData();
  }, []);

  const handleSearch = async (evt) => {
    const nameSearchText = document.getElementById("search-name").value;    
    const searchNameQuery = queryBuilder("repositoryPage", "", nameSearchText)   
    await setInitData();
    
  }

  return (
    <section className="home">
      <div className="container">
        <label > имя:
          <input id='search-name' type="text" />
        </label>
        <label > звезды:
          <input id='search-stars' type="text" />
        </label>
        <label > обновлен:
          <input id='search-date' type="text" />
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
