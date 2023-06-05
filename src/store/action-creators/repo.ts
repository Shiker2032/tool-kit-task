import { FetchRepoActionTypes, IEdgeNode } from "../../types/repo"
import { queryFetcher } from "../../utilts/utilts"

export const fetchRepos = (query = "") => {
    return async (dispatch) => {
        try {           
            dispatch({type: FetchRepoActionTypes.FETCH_REPOS})
            const {data:{search:{edges}}} = await queryFetcher(query);
            edges.forEach(
                (edge: IEdgeNode) =>
                (edge.node.updatedAt = new Date(
                  edge.node.updatedAt
                ).toLocaleDateString()));
              dispatch({type: FetchRepoActionTypes.FETCH_REPOS_SUCCESS, payload: edges })
        } catch (err) {
            dispatch ({type: FetchRepoActionTypes.FETCH_REPOS_ERROR, payload: "Error on repo fetch"})
        }
    }
}
