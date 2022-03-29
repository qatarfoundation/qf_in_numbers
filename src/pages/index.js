// React
import * as React from 'react';

// CSS
import '@/assets/styles/app.scss';
import * as styles from '@/pages/index/style.module.scss';

// Components
import Heading from '@/components/Heading';
import ThePreloader from '@/components/ThePreloader';

const IndexPage = () => {
    return (
        <div className={ styles.page }>
            <div className={ styles.container }>
                <Heading title="Home" />
            </div>

            <ThePreloader />
        </div>
    );
};

export default IndexPage;
