// Vendor
import React from 'react';

// CSS
import '@/assets/styles/app.scss';
import * as styles from '@/pages/index/style.module.scss';

// Components
import Heading from '@/components/Heading';

const IndexPage = () => {
    return (
        <div className={ styles.page }>
            <div className={ styles.container }>
                <Heading title="Home" />
            </div>
        </div>
    );
};

export default IndexPage;
