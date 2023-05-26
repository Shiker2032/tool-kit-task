//@ts-nocheck
import { useEffect, useState } from 'react';
import './App.css';

const token = import.meta.env.VITE_TOKEN;
const PAGE_SIZE = 10;

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

const getTotalPages = () => {
  return queryBuilder(`
  query { 
    viewer { 
      repositories (first:10, orderBy:{field:UPDATED_AT, direction:DESC}) {
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

const getAll = async () => {
  const allPages = await queryBuilder(`
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


const getRepositories = async () => {
  const totalPages = Math.ceil(await getTotalPages() / PAGE_SIZE)
  await getAll();


  const cursors = [];
  for (let i = 0; i < totalPages; i++) {
    if (i == 0) {
      const cursor = await getCursor(PAGE_SIZE);
      cursors.push(cursor);
    } else if (i == totalPages - 1) {
      console.log('last step')
    } else {
      const cursor = await (getCursor(PAGE_SIZE, cursors[i - 1]))
      cursors.push(cursor);
    }
  }
  return cursors;
}




function App() {
  const [pageCursors, setPagesCursors] = useState([]);
  const [totalRepos, setTotalRepos] = useState([]);
  const [currentRepos, setCurrentRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [loading, setLoading] = useState(false);
  const lastItem = currentPage * perPage;
  const firstItem = lastItem - perPage;
  const totalPages = currentRepos.length / perPage;

  // const [cursors, setCursors] = useState([]);
  var cursors: any = [];

  const setData = async () => {
    const pages = await getRepositories();
    setPagesCursors(pages);

  }

  const increasePage = (page) => {
    setCurrentPage(page)
  };

  const updateRepos = () => {
    setCurrentRepos(totalRepos.slice(firstItem, lastItem));
  };

  const handlePageClick = (evt) => {
    const page = evt.target.textContent;
    console.log(page);
  
    const pageCursor = pageCursors[page];
    // TODO write a function call that would use pageCursor to paginate    
  }

  useEffect(() => {
    setData();
  }, []);
  useEffect(() => updateRepos, [currentPage]);
  return (
    <>
      <ul>
        {pageCursors.map((page, i) => (<li onClick={(evt) => handlePageClick(evt)} key={page}>{i + 1}</li>))}
      </ul>
    </>
  );
}

export default App;
