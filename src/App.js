import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { TypeAnimation } from "react-type-animation";
import HButton from './components/HButton';
import ContentCard from './components/ContentCard';
import InfoPopup from './components/InfoPopup';


function App() {
    const [devContent, setDevContent] = useState('dev');
    // indicator position state
    const [indicatorStyle, setIndicatorStyle] = useState({ left: '0px', top: '0px', opacity: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        // place indicator initially at the first active button if present
        const active = containerRef.current?.querySelector('.h-button.active') || containerRef.current?.querySelector('.h-button');
        if (active) moveIndicatorTo(active);
    }, []);

    const devContents = [
        'dev',
        'code',
        'web',
        'app',
        'js',
        'scss',
        'c2ss'
    ];

    const contentMap = {
        dev: { title: 'Developer', text: 'I build full-stack applications and APIs.' },
        code: { title: 'Code', text: 'I write clean, maintainable code in JS and more.' },
        web: { title: 'Web', text: 'Responsive websites and modern frontends.' },
        app: { title: 'App', text: 'Cross-platform apps with native feel.' },
        js: { title: 'JavaScript', text: 'JS, Node, and modern toolchains.' },
        scss: { title: 'SCSS', text: 'Styles, components, and responsive design.' },
        c2ss: { title: 'C2SS', text: 'Custom tooling and micro-optimizations.' }
    };

    const [popupOpen, setPopupOpen] = useState(false);

    const moveIndicatorTo = (el) => {
        if (!el || !containerRef.current) return;
        const parentRect = containerRef.current.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        // compute coordinates relative to parent
        const left = elRect.left - parentRect.left + elRect.width / 2;
        const top = elRect.top - parentRect.top + elRect.height / 2;
        setIndicatorStyle({ left: `${left}px`, top: `${top}px`, opacity: 1 });
    };

    // Graph adjacency for H nodes (ids map to positions)
    const nodeOrder = ['top-left','top-right','middle-left','middle-right','bottom-left','bottom-right','middle-middle'];
    const adjacency = {
        'top-left': ['middle-left' ],
        'top-right': [ 'middle-right'],
        'middle-left': ['top-left','middle-middle','bottom-left'],
        'middle-right': ['top-right','middle-middle','bottom-right'],
        'bottom-left': ['middle-left'  ],
        'bottom-right': [ 'middle-right'],
        'middle-middle': ['middle-left','middle-right']
    };

    const findPath = (startId, endId) => {
        // BFS
        const queue = [[startId]];
        const visited = new Set([startId]);
        while (queue.length) {
            const path = queue.shift();
            const node = path[path.length-1];
            if (node === endId) return path;
            for (const nbr of (adjacency[node] || [])) {
                if (!visited.has(nbr)) {
                    visited.add(nbr);
                    queue.push([...path, nbr]);
                }
            }
        }
        return null;
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const moveAlongPath = async (path) => {
        for (const id of path) {
            const el = containerRef.current.querySelector(`.h-button.${id}`);
            if (el) moveIndicatorTo(el);
            // wait for transition to mostly complete
            await sleep(220);
        }
    };

    const getNodeIdFromEl = (el) => {
        if (!el) return null;
        for (const id of nodeOrder) {
            if (el.classList.contains(id)) return id;
        }
        return null;
    };

    const handleButtonClick = (content, e) => {
        const target = e.currentTarget;
        const startEl = containerRef.current.querySelector('.h-button.active') || containerRef.current.querySelector('.h-button');
        const startId = getNodeIdFromEl(startEl) || 'top-left';
        const endId = getNodeIdFromEl(target) || '';
        setDevContent(content);
        // compute path and animate
        const path = findPath(startId, endId);
        if (path && path.length > 0) {
            moveAlongPath(path);
        } else {
            moveIndicatorTo(target);
        }
    };

    return (
        <div className="app">
            {/* blurred right background layer */}
            <div className="bg-right" aria-hidden="true" />

            {/* Title */}
            <div className="title">
                <AnimatedTitle />
            </div>

            {/* Letters Container */}
            <div className="letters-container" ref={containerRef}>
                {/* Letter O with dev content */}
                <div className="letter-o">
                    <div className="o-content">
                        <ContentCard
                            title={contentMap[devContent].title}
                            text={contentMap[devContent].text}
                            onKnowMore={() => setPopupOpen(true)}
                        />
                    </div>
                </div>

                {/* Letter H with 6 buttons integrated into the letter */}
                <div className="letter-h">
                    {/* H letter structure */}
                    <div className="h-left-line"></div>
                    <div className="h-right-line"></div>
                    <div className="h-horizontal-line"></div>

                    {/* 6 buttons integrated into H letter */}
                    <HButton id="top-left" label={devContents[0]} active={devContents[0] === devContent} onClick={(e) => handleButtonClick(devContents[0], e)} />

                    <HButton id="top-right" label={devContents[1]} active={devContents[1] === devContent} onClick={(e) => handleButtonClick(devContents[1], e)} />

                    <HButton id="middle-left" label={devContents[2]} active={devContents[2] === devContent} onClick={(e) => handleButtonClick(devContents[2], e)} />

                    <HButton id="middle-right" label={devContents[3]} active={devContents[3] === devContent} onClick={(e) => handleButtonClick(devContents[3], e)} />

                    <HButton id="bottom-left" label={devContents[4]} active={devContents[4] === devContent} onClick={(e) => handleButtonClick(devContents[4], e)} />

                    <HButton id="bottom-right" label={devContents[5]} active={devContents[5] === devContent} onClick={(e) => handleButtonClick(devContents[5], e)} />
                    <HButton id="middle-middle" label={devContents[6]} active={devContents[6] === devContent} onClick={(e) => handleButtonClick(devContents[6], e)} />

                </div>
                {/* moving circular indicator */}
                <div className="h-indicator" style={{ left: indicatorStyle.left, top: indicatorStyle.top, opacity: indicatorStyle.opacity }} />
            </div>
            {/* right-side overlay for readability */}
            <div className="overlay-right" aria-hidden="true" />

            <InfoPopup open={popupOpen} onClose={() => setPopupOpen(false)}>
                <h2>{contentMap[devContent].title} — Details</h2>
                <p>More information about {contentMap[devContent].title}. This can be expanded with images, links, or extra content.</p>
            </InfoPopup>
        </div>
    );
}
const AnimatedTitle = () => {
    return (
        <TypeAnimation
            sequence={[

                "O.H",          // Step 1: type "O.H"
                1000,            // wait 0.5 sec
                "Omar Hamsho",  // Step 2: type "Omar Hamsho"
                5000,
                "Software Engineer Full-Stack Developer",
                1500,
            ]}
            wrapper="h1"
            cursor={false}
            
            repeat={Infinity} // loop infinitely
            style={{ fontSize: "2rem", fontWeight: "bold" }}
        />
    );
};
export default App;
