//@ts-nocheck

interface IExplorer {
    items: [];
}

const Explorer = ({ items }: IExplorer) => {
    console.log(items);
    return (
        <>
            {items.map((item: { name }, i) => (
                <div key={i} className="card">
              
                        <h3 className="title">{item.name}</h3>
                        <p className="description"> <span className="text_bold">Описание:</span>{item.description}</p>
                        <ul className="info-list">
                            <li className="item">
                                <p><span className="text_bold">Обновлен:</span> {item.updatedAt}</p>
                            </li>
                            <li className="item">
                            <p><span className="text_bold">Звезды:</span> {item.stargazerCount}</p>
                            </li>
                        </ul>
                            
                            {/* <ul className="info-list">
                                <li className="item">
                                    <span className="text_bold" >Обновлен:</span> {item.updatedAt}
                                </li>
                                <li className="item">
                                    <span className="text_bold">кол-во звезд:</span>{item.stargazerCount}
                                </li>
                                <li className="item">
                                    <span className="text_bold">ссылка:</span>{item.url}
                                </li>
                            </ul> */}
                  
                    </div>
            
            ))}
        </>
    );
};

export default Explorer;
