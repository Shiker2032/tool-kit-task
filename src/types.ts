 export type EdgeNode = {
    node: {
        description: string,
          name: string,
          stargazerCount: number,
          updatedAt: string,
          url: string
    }
  }

 export interface IExplorer {
    items: EdgeNode[]
  }

