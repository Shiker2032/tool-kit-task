interface IRepoCard {
  node: {
    descripption: string;
    id: string;
    languages: string[];
    name: string;
    stargazerCount: number;
    updatedAt: string;
    url: string;
    owner: {
      avatarUrl: string;
      login: string;
      url: string;
    };
  };
}

export type { IRepoCard };
