interface IPagination {
  pages: number;
  handleClick: () => void;
}

const Pagination = ({ pages, handleClick }: IPagination) => {
  const pageNodes = [];
  for (let i = 1; i < pages && i < 10; i++) {
    pageNodes.push(
      <li className="item" key={i} onClick={handleClick}>
        {i}
      </li>
    );
  }
  return <ul className="pagination-list">{pageNodes}</ul>;
};

export default Pagination;
