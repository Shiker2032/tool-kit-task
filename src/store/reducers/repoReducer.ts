import { FetchRepoActionTypes, IRepoState, RepoAction } from "../../types/repo"

const initialState: any = {
    repos: [],
    loading: false,
    error: null,
}
export const repoReducer = (state = initialState, action: any ): IRepoState => {
    switch (action.type) {
        case FetchRepoActionTypes.FETCH_REPOS:
            return { loading: true, error: null, repos: [] }
        case FetchRepoActionTypes.FETCH_REPOS_SUCCESS:
            return { loading: false, error: null, repos: action.payload }
        case FetchRepoActionTypes.FETCH_REPOS_ERROR:
            return { loading: true, error: action.payload, repos: [] }
        default:
            return state;
    }
}