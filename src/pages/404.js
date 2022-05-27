// React
import * as React from 'react';

// CSS
import '@/assets/styles/app.scss';
import '@/pages/404/style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';
import { Link } from 'gatsby-plugin-react-i18next';

function NotFoundPage() {
    return (
        <main className='notFoundPage'>
            <div className="container">
                <h1 className='h4'>We can’t find the page you are looking for.</h1>
                <Link to={ '/' } className={ 'button button-pagination right' }>
                    <div className="icon icon-arrow">
                        <Arrow className={ 'arrow right' } />
                    </div>
                    <p className='p8'>{ 'Back to home' }</p>
                </Link>
            </div>
        </main>
    );
}

export default NotFoundPage;
