export interface IEdgeNode {
  node: {
    description: string;
    name: string;
    stargazerCount: number;
    updatedAt: string;
    url: string;
    id: string;
  };
}

//================================

interface IRepoState {
  repos: IEdgeNode[];
  loading: boolean;
  error: null | string;
}

enum FetchRepoActionTypes {
  FETCH_REPOS_SUCCESS = 'FETCH_REPOS_SUCCESS',
  FETCH_REPOS_ERROR = 'FETCH_REPOS_ERROR',
  FETCH_REPOS = 'FETCH_REPOS',
}

interface IFetchRepoAction {
  type: FetchRepoActionTypes.FETCH_REPOS;
}

interface IFetchRepoSuccessAction {
  type: FetchRepoActionTypes.FETCH_REPOS_SUCCESS;
  payload: any[];
}

interface IFetchRepoErrorAction {
  type: FetchRepoActionTypes.FETCH_REPOS_ERROR;
  payload: string;
}

type RepoAction =
  | IFetchRepoAction
  | IFetchRepoErrorAction
  | IFetchRepoSuccessAction;

export type { IRepoState, RepoAction };
export { FetchRepoActionTypes };
