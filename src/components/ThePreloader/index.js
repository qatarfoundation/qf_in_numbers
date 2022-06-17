// Vendor
import React, { useEffect, useRef, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import gsap, { Power0, Power2 } from 'gsap';
import { usePresence } from 'framer-motion';
import SplitText from '@/assets/scripts/SplitText';
gsap.registerPlugin(SplitText);

// CSS
import './style.scoped.scss';

function ThePreloader({ visible, progress, ...props }) {
    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();
    const [hide, setHide] = useState(false);
    /**
     * Refs
     */
    const containerRef = useRef();
    const listYearsRef = useRef();
    const yearsRef = useRef(new Array());
    const amorceRef = useRef();
    /**
      * Datas
      */
    const data = useStaticQuery(graphql`
        query {
            allContentfulYear {
                edges {
                    node {
                        year
                        node_locale
                    }
                }
            }
        }
    `);
    const { i18n } = useTranslation();
    const years = data.allContentfulYear.edges.filter(function(object, i) {
        const year = object.node.year;
        if (object.node.node_locale === i18n.language) {
            return object;
        }
    }).sort((a, b) => b.node.year - a.node.year);
    const timeline = new gsap.timeline();
    /**
     * Effects
     */
    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);
    useEffect(() => {
        yearsRef.current = yearsRef.current.slice(0, years.length);
    }, [years]);
    useEffect(() => {
        let tick = 0;
        gsap.fromTo(yearsRef.current.reverse(), 3.5, {
            y: 0,
            opacity: (_index, _target, _targets) => {
                let goal = (1 / _targets.length) * _index;
                goal = map_range(goal, 0, (1 / _targets.length) * (_targets.length - 1), 0, 1);
                goal = Math.abs(1.0 - goal);
                return goal == 1 ? goal : goal / 8;
            },
        }, {
            yPercent: (100 * (yearsRef.current.length - 1)) * progress,
            ease: Power2.easeInOut,
            onUpdate() {
                if (tick !== 0) {
                    let min = undefined;
                    let max = undefined;
                    const differencies = [];
                    this._targets.forEach((_target, _index) => {
                        let goal = (1 / this._targets.length) * _index;
                        goal = map_range(goal, 0, (1 / this._targets.length) * (this._targets.length - 1), 0, 1);
                        let diff = Math.abs(this.ratio - goal);
                        diff = Math.abs(1.0 - diff);
                        differencies.push(diff);
                        if (max == undefined) max = diff;
                        if (min == undefined) min = diff;
                        if (diff > max) max = diff;
                        if (diff < min) min = diff;
                    });
                    this._targets.forEach((_target, _index) => {
                        const diff = map_range(differencies[_index], min, max, 0, 1);
                        gsap.to(_target, 0.5, {
                            opacity: diff == 1 ? diff : diff / 8,
                        });
                    });
                }
                tick++;
            },
            onComplete() {
                if (progress == 1) {
                    timeline.to(amorceRef.current, 0, { opacity: 1 });
                    const amorceSplitText = new SplitText(amorceRef.current, { type: 'lines,chars', linesClass: 'line', charsClass: 'char' });
                    const lines = amorceSplitText.lines;
                    timeline.add('charsLineIn');
                    lines.forEach((line, i) => {
                        timeline.to(line.querySelectorAll('.char'), 1, { opacity: 1, stagger: 0.015, ease: Power0.easeOut }, 'charsLineIn');
                    });
                    timeline.add('charsLineOut', 5);
                    lines.forEach((line, i) => {
                        timeline.to(line.querySelectorAll('.char'), 0.9, { opacity: 0, stagger: 0.01, ease: Power0.easeIn }, 'charsLineOut');
                    });
                    timeline.to(listYearsRef.current, 0.9, { opacity: 0, ease: Power0.easeIn }, 'charsLineOut');
                    timeline.add(transitionOut());
                }
            },
        }, 0.75);
        return () => {
            timeline.pause();
            timeline.kill();
        };
    }, [progress]);

    /**
     * Private
     */
    function transitionIn() {
        return gsap.to(listYearsRef.current, { duration: 1.5, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.to(containerRef.current, { duration: 1.5, alpha: 0, ease: 'sine.inOut', onComplete: transitionOutCompleted });
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        setHide(true);
        // safeToRemove();
    }

    function map_range(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }
    // return visible ? (
    //     <div className="the-preloader">The preloader</div>
    // ) : null;
    return !hide ? (
        <div ref={ containerRef } className="the-preloader">
            <ul ref={ listYearsRef }  className="list-years">
                { years.map(function(object, i) {
                    const year = object.node.year;
                    return <li key={ i } ref={ el => yearsRef.current[i] = el } className="list-item-year h4">
                        { year }
                    </li>;
                }) }
            </ul>
            <p ref={ amorceRef } className='h6 amorce'>Aliquam sed. Ut eget ut eu at diam. Sed a purus turpis rhoncus dictum sit fermentum ut id.</p>
        </div>
    ) : null ;
}

export default ThePreloader;
