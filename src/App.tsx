//@ts-nocheck
import { useEffect, useState } from 'react';
import './App.css';

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
  return await queryBuilder(`
  query { 
    viewer { 
      repositories (first:100, orderBy:{field:UPDATED_AT, direction:DESC}) {
        totalCount   
        pageInfo {
          endCursor
        }
        edges {
          cursor
          node {
            name
          }
        }
      }
    }
  }`)
}

const getTotalPages = () => {
  return queryBuilder(`
  query { 
    viewer { 
      repositories (first:${PAGE_SIZE}, orderBy:{field:UPDATED_AT, direction:DESC}) {
        totalCount   
      }
    }
  }
  `).then((json) => {
    const { data: { viewer: { repositories: { totalCount } } } } = json;
    return totalCount;
  })
}

const getCursor = async (pageSize: number, prev: string) => {
  const direction = prev ? `after:"${prev}"` : "";
  const edge = await queryBuilder(`
  query { 
    viewer { 
      repositories (first:${pageSize}, orderBy:{field:UPDATED_AT, direction:DESC}, ${direction}) {
        totalCount
        pageInfo{
          endCursor
        }
        edges {
          cursor
          node {
            name
          }
        }
      }
    }
  }`)
  const { data: { viewer: { repositories: { pageInfo: { endCursor } } } } } = edge;
  return endCursor;
}



function App() {
  const [pageCursors, setPagesCursors] = useState([]);
  const [repositoriesList, setRepositoriesList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const pageNodes = [];

  const getCursors = async () => {
    const totalPages = Math.ceil(await getTotalPages() / PAGE_SIZE)
    const cursors = ["",];

    setTotalPages(totalPages);
    await getAll();
    for (let i = 0; i <= totalPages; i++) {
      if (i !== 0) {
        const cursor = await (getCursor(PAGE_SIZE, cursors[i - 1]))
        cursors.push(cursor);       
      }      
    }
    return cursors;
  }

  const setData = async () => {
    const pages = await getCursors();
    setPagesCursors(pages);
  }

  const handlePageClick = async (evt) => {
    const page = evt.target.textContent;
    const pageData = await getPage(page);
    const { data: { viewer: { repositories: { edges } } } } = pageData
    setRepositoriesList(edges.map((el) => (el.node.name)));
  }

  const getPage = async (page: number) => {
    if (page == 1) {
      return await queryBuilder(`
      {
        viewer {
          repositories(first: ${PAGE_SIZE}, orderBy: {field: UPDATED_AT, direction: DESC}) {      
            edges {             
              node {
                name
              }
            }
          }
        }
      }
      `)
    } else {
      return await queryBuilder(`
      {
        viewer {
          repositories(first: ${PAGE_SIZE}, orderBy: {field: UPDATED_AT, direction: DESC}, after:"${pageCursors[page - 1]}") {      
            edges {            
              node {
                name
              }
            }
          }
        }
      }
      `)
    }
  }

  useEffect(() => {
    setData();
  }, []);

  for (let i = 0; i < totalPages; i++) {
    pageNodes.push(<li key={i} onClick={((evt) => handlePageClick(evt))}>{i + 1}</li>)
  }

  return (
    <>
      <div>
        {repositoriesList.map((el, i) => (<p key={i}>{el}</p>))}
      </div>
      <ul>
        {pageNodes}
      </ul>
    </>
  );
}

export default App;
