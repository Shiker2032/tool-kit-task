import { useEffect, useState } from 'react';
// import { useAppSelector, useAppDispatch } from './app/hooks'
// import { updateUser } from "./features/user-slice"
import './App.scss';
import Pagination from './components/Pagination';
import Explorer from './components/Explorer';
import { IEdgeNode } from './types/repo';
// import { gitGraphApi } from './services/gitGraph-service';
import { useDispatch } from 'react-redux';
import { queryFetcher } from './utilts/utilts';
import { PAGE_SIZE } from './utilts/consts';
import { fetchRepos } from './store/action-creators/repo';
import { useAppDispatch } from './store/hooks/useTypedSelector';

const getTotalPages = async () => {
  const queryForTotalPages = await (queryBuilder("totalPages", ""))
  const { data: { search: { repositoryCount } } } = await queryFetcher(queryForTotalPages);
  return repositoryCount
};

const queryBuilder =  (type: string, prev: string = "",) => {
  const searchName = document.getElementById("search-name") as HTMLInputElement | null;
  const searchStars = document.getElementById("search-stars") as HTMLInputElement | null;
  const searchDate = document.getElementById("search-date") as HTMLInputElement | null;


  var searchParams = '';
  var prevParams = '';
  var query = '';

  if (searchName?.value) {
    searchParams += `${searchName.value} in :name,`
  }

  if (searchStars?.value) {
    searchParams += `stars:>=${searchStars.value},`
  }

  if (searchDate?.value) {
    searchParams += `pushed:>${searchDate.value},`
  }

  if (prev) {
    prevParams += `, after:"${prev}"`
  }

  switch (type) {
    case "getUser":
      query = `
    {
      viewer {
        login
      }
    }`
    break;
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

function App() {

  const dispatch = useAppDispatch();




  const [pageCursors, setPagesCursors] = useState(['']);
  const [totalPages, setTotalPages] = useState(0);
  const [] = useState(false);
  // const {data}  = gitGraphApi.useFetchUserQuery(queryBuilder("getUser"));



  const getCursors = async () => {
    const totalPages = Math.ceil((await getTotalPages()) / PAGE_SIZE);
    const cursors = [''];
    setTotalPages(totalPages);

    for (let i = 0; i <= totalPages && i < 10; i++) {
      if (i !== 0) {
        const getCursorQuery = await queryBuilder("getCursor", cursors[i - 1]);
        const { data: { search: { pageInfo: { endCursor } } } } = await queryFetcher(getCursorQuery);
        cursors.push(endCursor);
      }
    }
    return cursors;
  };


  const updateData = async () => {
    const pages = await getCursors();
    await getPage(1);   
    setPagesCursors(pages);    
  };

  const handlePageClick = async (evt: React.ChangeEvent<HTMLUListElement>) => {
    const page: string =
      evt.target.textContent !== null ? evt.target.textContent : '0';
      await getPage(parseInt(page));   
  };

  const getPage = async (page: number) => {
    if (page == 1) {
      const query = queryBuilder("repositoryPage")
       dispatch(fetchRepos(query));
    } else {
      const queryForPage = await queryBuilder("repositoryPage", pageCursors[page - 1]);
      dispatch(fetchRepos(queryForPage));
    }
  };

  useEffect(() => {
    updateData();
  }, []);

  const handleSearch = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    await updateData();
  }

  return (
    <section className="home">
      <div className="container">
        <div className="explorer">
          <form className='form' onSubmit={handleSearch} id='search-form'>
            <div className="inputs">
              <label > имя:
                <input id='search-name' className='search-input' type="text" />
              </label>
              <label > звезды:
                <input id='search-stars' type="number" />
              </label>
              <label > обновлен:
                <input id='search-date' type="date" />
              </label>
            </div>
            <button type='submit' className='submit-btn'>Найти</button>
          </form>          
            <>
              <Explorer></Explorer>
              <div className="pagination">
                <Pagination pages={totalPages} handleClick={handlePageClick} />
              </div>
            </>
          
        </div>
      </div>
    </section>
  );
}

export default App;
