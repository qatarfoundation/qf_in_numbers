// React
import * as React from 'react';

// CSS
import '@/assets/styles/app.scss';
import '@/pages/404/style.scoped.scss';

// Components
import Heading from '@/components/Heading';

const NotFoundPage = () => {
    return (
        <main>
            <div className="container">
                <Heading title="404" />
            </div>
        </main>
    );
};

export default NotFoundPage;
