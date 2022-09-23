import React from 'react';
import { InView } from 'react-intersection-observer';
import Odometer from 'Odometer';

// CSS
import './style.scoped.scss';

function ProgressNumber({
    as = 'span',
    className = 'progress-number',
    threshold = 0.5,
    children,
    ...props
}) {
    let flag = false;

    return (
        <InView
            as={ as }
            initialInView={ false }
            threshold={ threshold }
            rootMargin="0px 0px -80px 0px"
            className={ className }
            onChange={ (inView, entry) =>{
                if(inView && entry &&  !flag) {
                    flag = true;
                    const item = entry.target.querySelector('.value span');
                    const od = new Odometer({
                        el : item,
                        value : 0,
                        theme: 'default',
                    });

                    od.update(entry.target.querySelector('.value').dataset.number);
                }
            }

            }
            { ...props }
        >
            { children }
        </InView>
    );
}

export default ProgressNumber;
