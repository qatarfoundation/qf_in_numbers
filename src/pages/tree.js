// React
import * as React from 'react';

// CSS
import '@/assets/styles/app.scss';
import * as styles from '@/pages/tree/style.module.scss';

// Components
import Heading from '@/components/Heading';

const TreePage = () => {
    return (
        <div className={ styles.page }>
            <div className={ styles.container }>
                <Heading title="Tree" />
            </div>
        </div>
    );
};

export default TreePage;
