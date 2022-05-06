// React
import React from 'react';

// CSS
import './style.scoped.scss';

function CardArticle(props, ref) {
    /**
     * Datas
     */
    const { title, description, image, url, tags } = props.article;
    return (
        <>
            <a className="card-link" href={ url } target="_blank" rel="noreferrer">
                <div className="card card-article">
                    <div className="img-container">
                        <img src={ image.file.url } alt={ image.title } />
                    </div>
                    <p className="tag p4">{ tags.join(' ') }</p>
                    <h3 className="title p2">{ title }</h3>
                    <p className="description p4">{ description }</p>
                </div>
            </a>
        </>
    );
}

export default CardArticle;
