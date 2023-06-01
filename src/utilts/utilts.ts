import { PAGE_SIZE, TOKEN } from "./consts";

const queryFetcher = (query: string) => {
    return fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());
  };
  


  export {
     queryFetcher
  }
  